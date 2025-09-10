import { Tool } from "@uaito/sdk";



export const executeCommandTool: Tool = {
  name: "executeCommand",
  description: "Execute commands in a unix shell. This tool should be used when you need to run code and see its output or check for errors. All code execution happens exclusively in this isolated environment. The tool will return the standard output, standard error, and return code of the executed code. Long-running processes will return a process ID for later management.",
  input_schema: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "The code to run in the unix environment. Make sure that it is a valid unix command"
      }
    },
    required: ["code"]
  }
};


export const createFolderTool: Tool = {
  name: "createFolder",
  description: "Create directories. This tool is used to create directories inside the current workspace",
  input_schema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "the directory"
      }
    },
    required: ["path"]
  }
};


export const createFileTool: Tool = {
  name: "createFile",
  description: "Create a new file at the specified path with the given content. This tool should be used when you need to create a new file in the project structure. It will create all necessary parent directories if they don't exist. The tool will return a success message if the file is created, and an error message if there's a problem creating the file or if the file already exists. The content should be as complete and useful as possible, including necessary imports, function definitions, and comments.",
  input_schema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The absolute or relative path where the file should be created. Use forward slashes (/) for path separation, even on Windows systems."
      },
      content: {
        type: "string",
        description: "Optional parameter to provide the file contents as plain text"
      },
      contentMimeType: {
        type: "string",
        description: "If not concretely specified will configure one by default based on the content"
      },
      encoding: {
        type: "string",
        description: "Optional parameter that can be 'plainText' or 'base64' and define the content's encoding, by default will be set based on the content"
      }
    },
    required: ["path"]
  }
}


export const editAndApplyTool: Tool = {
  name: "editAndApply",
  description: "Apply AI-powered improvements to a file based on specific instructions and detailed project context. This function reads the file, processes it in batches using AI with conversation history and comprehensive code-related project context. It generates a diff and allows the user to confirm changes before applying them. The goal is to maintain consistency and prevent breaking connections between files. This tool should be used for complex code modifications that require understanding of the broader project context.",
  input_schema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The absolute or relative path of the file to edit. Use forward slashes (/) for path separation, even on Windows systems."
      },
      original_content: {
        type: 'string',
        description: 'Contains the content of the original file we want to edit'
      },
      instructions: {
        type: "string",
        description: "After completing the code review, construct a plan for the change between <PLANNING> tags. Ask for additional source files or documentation that may be relevant. The plan should avoid duplication (DRY principle), and balance maintenance and flexibility. Present trade-offs and implementation choices at this step. Consider available Frameworks and Libraries and suggest their use when relevant. STOP at this step if we have not agreed a plan.\n\nOnce agreed, produce code between <OUTPUT> tags. Pay attention to Variable Names, Identifiers and String Literals, and check that they are reproduced accurately from the original source files unless otherwise directed. When naming by convention surround in double colons and in ::UPPERCASE::. Maintain existing code style, use language appropriate idioms. Produce Code Blocks with the language specified after the first backticks"
      },
      project_context: {
        type: "string",
        description: "Comprehensive context about the project, including recent changes, new variables or functions, interconnections between files, coding standards, and any other relevant information that might affect the edit."
      }
    },
    required: ["path", "instructions", "project_context"]
  }
}

export const readFileTool: Tool = {
  name: "readFile",
  description: "Read the contents of a file at the specified path. This tool should be used when you need to examine the contents of an existing file. It will return the entire contents of the file as a string. If the file doesn't exist or can't be read, an appropriate error message will be returned.",
  input_schema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The absolute or relative path of the file to read. Use forward slashes (/) for path separation, even on Windows systems."
      }
    },
    required: ["path"]
  }
}
export const listFilesTool: Tool = {
  name: "listFiles",
  description: "List all files and directories in the specified folder. This tool should be used when you need to see the contents of a directory. It will return a list of all files and subdirectories in the specified path. If the directory doesn't exist or can't be read, an appropriate error message will be returned.",
  input_schema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The absolute or relative path of the folder to list. Use forward slashes (/) for path separation, even on Windows systems. If not provided, the current working directory will be used."
      }
    }
  }
}
export const browseWebPageTool: Tool = {
  name: "browseWebPage",
  description: `Opens the desired url to either get the source html code or to directly extract the redable texts`,
  input_schema: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "The url parameter must include http or https or file."
      },
      extractText: {
        type: 'boolean',
        description: "If true, will return the content texts only. When not specified, or when false, we will return the whole html code."
      }
    },
    required: ['url']
  }
}

export const tavilySearch: Tool = {
  name: "tavilySearch",
  description: "Perform a web search using the Tavily API to get up-to-date information or additional context. This tool should be used when you need current information or feel a search could provide a better answer to the user's query. It will return a summary of the search results, including relevant snippets and source URLs.",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query. Be as specific and detailed as possible to get the most relevant results."
      }
    },
    required: ["query"]
  }
}
