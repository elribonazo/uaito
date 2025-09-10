

interface ParsedCall {
    name: string;
    positionalArgs: unknown[];
    keywordArgs: Record<string, unknown>;
  }

export function parseArguments(argsString: string): string[] {
    const args: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";
    let pDepth = 0; 
    let bDepth = 0; 

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
        pDepth++;
        current += char;
      } else if (!inQuotes && char === ")") {
        pDepth--;
        current += char;
      } else if (!inQuotes && char === "{") {
        bDepth++;
        current += char;
      } else if (!inQuotes && char === "}") {
        bDepth--;
        current += char;
      } else if (!inQuotes && char === "," && pDepth === 0 && bDepth === 0) {
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

  export function extractPythonicCalls(toolCallContent: string): string[] {
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

  export function  parsePythonicCall(command: string): ParsedCall | null {
    try {
      const parsed = JSON.parse(command);
      if (Array.isArray(parsed)) {
        return parsed.map((call) => this.parsePythonicCall(call)) as any;
      }
      return {
        ...parsed,
        positionalArgs:[],
        keywordArgs: parsed.arguments
      };
    } catch {
      const callMatch = command.match(/^([a-zA-Z0-9_]+)\((.*)\)$/s);
      if (!callMatch) return null;
  
      const [, name, argsStr] = callMatch;
      const args = parseArguments(argsStr);
      const positionalArgs: unknown[] = [];
      const keywordArgs: Record<string, unknown> = {};
  
      for (const arg of args) {
        const kwargMatch = arg.match(/^([a-zA-Z0-9_]+)\s*=\s*(.*)$/s);
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
    }

  };


  export function mapArgsToNamedParams(  paramNames: string[],  positionalArgs: unknown[], keywordArgs: Record<string, unknown>): Record<string, unknown> {
    const namedParams: Record<string, unknown> = {};
    positionalArgs.forEach((arg, idx) => {
      if (idx < paramNames.length) {
        namedParams[paramNames[idx]] = arg;
      }
    });
    Object.assign(namedParams, keywordArgs);
    return namedParams;
  };