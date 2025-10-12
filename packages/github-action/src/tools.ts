import type { Tool } from "@uaito/sdk";

export const seeIssuesTool: Tool = {
    name: "seeIssues",
    description: "See issues created in the current github repository",
    input_schema: {
        type: "object",
        properties: {
            owner: {
                type: "string",
                description: "The owner of the repository"
            },
            repo: {
                type: "string",
                description: "The name of the repository"
            }
        },
        required: ["owner", "repo"]
    }
};

export const createIssueTool: Tool = {
    name: "createIssue",
    description: "Create an issue on behalf of another github user",
    input_schema: {
        type: "object",
        properties: {
            owner: {
                type: "string",
                description: "The owner of the repository"
            },
            repo: {
                type: "string",
                description: "The name of the repository"
            },
            title: {
                type: "string",
                description: "The title of the issue"
            },
            body: {
                type: "string",
                description: "The body of the issue"
            }
        },
        required: ["owner", "repo", "title"]
    }
};

export const replyToCommentTool: Tool = {
    name: "replyToComment",
    description: "Reply to a comment on a github issue",
    input_schema: {
        type: "object",
        properties: {
            owner: {
                type: "string",
                description: "The owner of the repository"
            },
            repo: {
                type: "string",
                description: "The name of the repository"
            },
            issue_number: {
                type: "number",
                description: "The issue number"
            },
            body: {
                type: "string",
                description: "The body of the comment"
            }
        },
        required: ["owner", "repo", "issue_number", "body"]
    }
};

export const createBranchTool: Tool = {
    name: "createBranch",
    description: "Create a github branch",
    input_schema: {
        type: "object",
        properties: {
            owner: {
                type: "string",
                description: "The owner of the repository"
            },
            repo: {
                type: "string",
                description: "The name of the repository"
            },
            branch: {
                type: "string",
                description: "The name of the branch"
            },
            sha: {
                type: "string",
                description: "The SHA of the commit to base the branch on"
            }
        },
        required: ["owner", "repo", "branch", "sha"]
    }
};

export const createAndPushCodeTool: Tool = {
    name: "createAndPushCode",
    description: "Create and push code to a github branch",
    input_schema: {
        type: "object",
        properties: {
            owner: {
                type: "string",
                description: "The owner of the repository"
            },
            repo: {
                type: "string",
                description: "The name of the repository"
            },
            branch: {
                type: "string",
                description: "The name of the branch"
            },
            files: {
                type: "array",
                description: "An array of files to create or update",
                items: {
                    type: "object",
                    properties: {
                        path: {
                            type: "string",
                            description: "The path of the file"
                        },
                        content: {
                            type: "string",
                            description: "The content of the file"
                        }
                    },
                    required: ["path", "content"]
                }
            },
            commit_message: {
                type: "string",
                description: "The commit message"
            }
        },
        required: ["owner", "repo", "branch", "files", "commit_message"]
    }
};

export const createPullRequestTool: Tool = {
    name: "createPullRequest",
    description: "Create a pull request",
    input_schema: {
        type: "object",
        properties: {
            owner: {
                type: "string",
                description: "The owner of the repository"
            },
            repo: {
                type: "string",
                description: "The name of the repository"
            },
            title: {
                type: "string",
                description: "The title of the pull request"
            },
            head: {
                type: "string",
                description: "The name of the branch where your changes are implemented"
            },
            base: {
                type: "string",
                description: "The name of the branch you want the changes pulled into"
            },
            body: {
                type: "string",
                description: "The body of the pull request"
            }
        },
        required: ["owner", "repo", "title", "head", "base"]
    }
};

export const mergePullRequestTool: Tool = {
    name: "mergePullRequest",
    description: "Merge a pull request",
    input_schema: {
        type: "object",
        properties: {
            owner: {
                type: "string",
                description: "The owner of the repository"
            },
            repo: {
                type: "string",
                description: "The name of the repository"
            },
            pull_number: {
                type: "number",
                description: "The number of the pull request"
            }
        },
        required: ["owner", "repo", "pull_number"]
    }
};
