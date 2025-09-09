interface ParsedCall {
  name: string;
  positionalArgs: any[];
  keywordArgs: Record<string, any>;
}

interface Schema {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<
      string,
      {
        type: string;
        description: string;
        default?: any;
      }
    >;
    required: string[];
  };
}

interface JSDocParam {
  type: string;
  description: string;
  isOptional: boolean;
  defaultValue?: string;
}

const parseArguments = (argsString: string): string[] => {
  const args: string[] = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";
  let depth = 0;

  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i];

    if (!inQuotes && (char === '"' || char === "'")) {
      inQuotes = true;
      quoteChar = char;
      current += char;
    } else if (inQuotes && char === quoteChar) {
      inQuotes = false;
      quoteChar = "";
      current += char;
    } else if (!inQuotes && char === "(") {
      depth++;
      current += char;
    } else if (!inQuotes && char === ")") {
      depth--;
      current += char;
    } else if (!inQuotes && char === "," && depth === 0) {
      args.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args;
};

export const extractPythonicCalls = (toolCallContent: string): string[] => {
  try {
    const cleanContent = toolCallContent.trim();

    try {
      const parsed = JSON.parse(cleanContent);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Fallback to manual parsing
    }

    if (cleanContent.startsWith("[") && cleanContent.endsWith("]")) {
      const inner = cleanContent.slice(1, -1).trim();
      if (!inner) return [];
      return parseArguments(inner).map((call) =>
        call.trim().replace(/^['"]|['"]$/g, ""),
      );
    }

    return [cleanContent];
  } catch (error) {
    console.error("Error parsing tool calls:", error);
    return [];
  }
};

export const parsePythonicCalls = (command: string): ParsedCall | null => {
  const callMatch = command.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
  if (!callMatch) return null;

  const [, name, argsStr] = callMatch;
  const args = parseArguments(argsStr);
  const positionalArgs: any[] = [];
  const keywordArgs: Record<string, any> = {};

  for (const arg of args) {
    const kwargMatch = arg.match(/^([a-zA-Z0-9_]+)\s*=\s*(.*)$/);
    if (kwargMatch) {
      const [, key, value] = kwargMatch;
      try {
        keywordArgs[key] = JSON.parse(value);
      } catch {
        keywordArgs[key] = value;
      }
    } else {
      try {
        positionalArgs.push(JSON.parse(arg));
      } catch {
        positionalArgs.push(arg);
      }
    }
  }
  return { name, positionalArgs, keywordArgs };
};

export const extractFunctionAndRenderer = (
  code: string,
): { functionCode: string; rendererCode?: string } => {
  if (typeof code !== "string") {
    return { functionCode: code };
  }

  const exportMatch = code.match(/export\s+default\s+/);
  if (!exportMatch) {
    return { functionCode: code };
  }

  const exportIndex = exportMatch.index!;
  const functionCode = code.substring(0, exportIndex).trim();
  const rendererCode = code.substring(exportIndex).trim();

  return { functionCode, rendererCode };
};

/**
 * Helper function to extract JSDoc parameters from JSDoc comments.
 */
const extractJSDocParams = (
  jsdoc: string,
): Record<string, JSDocParam & { jsdocDefault?: string }> => {
  const jsdocParams: Record<string, JSDocParam & { jsdocDefault?: string }> =
    {};
  const lines = jsdoc
    .split("\n")
    .map((line) => line.trim().replace(/^\*\s?/, ""));
  const paramRegex =
    /@param\s+\{([^}]+)\}\s+(\[?[a-zA-Z0-9_]+(?:=[^\]]+)?\]?|\S+)\s*-?\s*(.*)?/;

  for (const line of lines) {
    const paramMatch = line.match(paramRegex);
    if (paramMatch) {
      let [, type, namePart, description] = paramMatch;
      description = description || "";
      let isOptional = false;
      let name = namePart;
      let jsdocDefault: string | undefined = undefined;

      if (name.startsWith("[") && name.endsWith("]")) {
        isOptional = true;
        name = name.slice(1, -1);
      }
      if (name.includes("=")) {
        const [n, def] = name.split("=");
        name = n.trim();
        jsdocDefault = def.trim().replace(/['"]/g, "");
      }

      jsdocParams[name] = {
        type: type.toLowerCase(),
        description: description.trim(),
        isOptional,
        defaultValue: undefined,
        jsdocDefault,
      };
    }
  }
  return jsdocParams;
};

/**
 * Helper function to extract function signature information.
 */
const extractFunctionSignature = (
  functionCode: string,
): {
  name: string;
  params: { name: string; defaultValue?: string }[];
} | null => {
  const functionSignatureMatch = functionCode.match(
    /function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/,
  );
  if (!functionSignatureMatch) {
    return null;
  }

  const functionName = functionSignatureMatch[1];
  const params = functionSignatureMatch[2]
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const [name, defaultValue] = p.split("=").map((s) => s.trim());
      return { name, defaultValue };
    });

  return { name: functionName, params };
};

export const generateSchemaFromCode = (code: string): Schema => {
  const { functionCode } = extractFunctionAndRenderer(code);

  if (typeof functionCode !== "string") {
    return {
      name: "invalid_code",
      description: "Code is not a valid string.",
      parameters: { type: "object", properties: {}, required: [] },
    };
  }

  // 1. Extract function signature, name, and parameter names directly from the code
  const signatureInfo = extractFunctionSignature(functionCode);
  if (!signatureInfo) {
    return {
      name: "invalid_function",
      description: "Could not parse function signature.",
      parameters: { type: "object", properties: {}, required: [] },
    };
  }

  const { name: functionName, params: paramsFromSignature } = signatureInfo;

  const schema: Schema = {
    name: functionName,
    description: "",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  };

  // 2. Parse JSDoc comments to get descriptions and types
  const jsdocMatch = functionCode.match(/\/\*\*([\s\S]*?)\*\//);
  let jsdocParams: Record<string, JSDocParam & { jsdocDefault?: string }> = {};
  if (jsdocMatch) {
    const jsdoc = jsdocMatch[1];
    jsdocParams = extractJSDocParams(jsdoc);

    const descriptionLines = jsdoc
      .split("\n")
      .map((line) => line.trim().replace(/^\*\s?/, ""))
      .filter((line) => !line.startsWith("@") && line);

    schema.description = descriptionLines.join(" ").trim();
  }

  // 3. Combine signature parameters with JSDoc info
  for (const param of paramsFromSignature) {
    const paramName = param.name;
    const jsdocInfo = jsdocParams[paramName];
    schema.parameters.properties[paramName] = {
      type: jsdocInfo ? jsdocInfo.type : "any",
      description: jsdocInfo ? jsdocInfo.description : "",
    };

    // Prefer default from signature, then from JSDoc
    if (param.defaultValue !== undefined) {
      // Try to parse as JSON, fallback to string
      try {
        schema.parameters.properties[paramName].default = JSON.parse(
          param.defaultValue.replace(/'/g, '"'),
        );
      } catch {
        schema.parameters.properties[paramName].default = param.defaultValue;
      }
    } else if (jsdocInfo && jsdocInfo.jsdocDefault !== undefined) {
      schema.parameters.properties[paramName].default = jsdocInfo.jsdocDefault;
    }

    // A parameter is required if:
    // - Not optional in JSDoc
    // - No default in signature
    // - No default in JSDoc
    const hasDefault =
      param.defaultValue !== undefined ||
      (jsdocInfo && jsdocInfo.jsdocDefault !== undefined);
    if (!jsdocInfo || (!jsdocInfo.isOptional && !hasDefault)) {
      schema.parameters.required.push(paramName);
    }
  }

  return schema;
};

/**
 * Extracts tool call content from a string using the tool call markers.
 */
export const extractToolCallContent = (content: string): string | null => {
  const toolCallMatch = content.match(
    /<\|tool_call_start\|>(.*?)<\|tool_call_end\|>/s,
  );
  return toolCallMatch ? toolCallMatch[1].trim() : null;
};

/**
 * Maps positional and keyword arguments to named parameters based on schema.
 */
export const mapArgsToNamedParams = (
  paramNames: string[],
  positionalArgs: any[],
  keywordArgs: Record<string, any>,
): Record<string, any> => {
  const namedParams: Record<string, any> = Object.create(null);
  positionalArgs.forEach((arg, idx) => {
    if (idx < paramNames.length) {
      namedParams[paramNames[idx]] = arg;
    }
  });
  Object.assign(namedParams, keywordArgs);
  return namedParams;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object") {
    return JSON.stringify(error);
  }
  return String(error);
};

/**
 * Adapted from https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser.
 */
export function isMobileOrTablet() {
  let check = false;
  (function (a: string) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.slice(0, 4),
      )
    )
      check = true;
  })(
    navigator.userAgent ||
      navigator.vendor ||
      ("opera" in window && typeof window.opera === "string"
        ? window.opera
        : ""),
  );
  return check;
}
