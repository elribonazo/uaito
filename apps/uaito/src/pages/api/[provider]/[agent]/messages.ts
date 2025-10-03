import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { SHA512 } from '@stablelib/sha512';
import { ErrorBlock, LLMProvider, Message, MessageArray, MessageInput, Tool, BaseAgent, UsageBlock } from '@uaito/sdk';
import { browseWebPageTool, createFileTool, createFolderTool, editAndApplyTool, executeCommandTool, readFileTool, tavilySearch } from '@/ai/tools';
import { findUserByEmail, IUser } from "@/db/models/User"
import { createUsage } from '@/db/models/Usage';
import { getSessionUser } from '@/utils/getSessionUser';
import db from '@/db';
import { AutomatedEngineer } from '@/ai/agents/AutomatedEngineer';
import { onTool as SystemOnTool } from '../../../../ai/agents/onTool';
import { ensureUserExists } from '../../auth/[...nextauth]';
import { AnthropicModels } from '@uaito/anthropic';
import { GrokModels, OpenAIModels } from '@uaito/openai';
import { GoogleModels } from '@uaito/google';

const SEPARATOR = "<-[*0M0*]->"

function toProvider(p: string | string[] | undefined): LLMProvider {
  const s = Array.isArray(p) ? p[0] : p;
  switch (s) {
    case 'OpenAI':
      return LLMProvider.OpenAI;
    case 'Anthropic':
      return LLMProvider.Anthropic;
    case 'Grok':
      return LLMProvider.Grok;
    case 'Google':
      return LLMProvider.Google;
    default:
      return LLMProvider.Anthropic;
  }
}

async function AutomatedEngineerTask(
  type: LLMProvider,
  res: NextApiResponse,
  currentUser: IUser,
  abortController: AbortController,
  inputs: MessageArray<MessageInput>,
  isGod: boolean,
  directory: string,
  prompt: string,
  selectedModel?: string,
  tools?: Tool[]
): Promise<{ hash: Uint8Array, stream: ReadableStream<Message> }> {
  const availableTools = tools && Array.isArray(tools) ?
    tools : directory ? [
      createFolderTool,
      createFileTool,
      editAndApplyTool,
      readFileTool,
      browseWebPageTool,
      tavilySearch,
      executeCommandTool,
    ] : [
      browseWebPageTool,
      tavilySearch,
    ];
  const activeTools = availableTools.map((tool) => {
    const { name, description, input_schema } = tool;
    return { name, description, input_schema }
  })

  let apiKey!: string;
  if (type === LLMProvider.Anthropic) {
    apiKey = process.env.ANTHROPIC_API_KEY!;
  } else if (type === LLMProvider.Grok) {
    apiKey = process.env.GROK_API_KEY!;
  } else if (type === LLMProvider.OpenAI) {
    apiKey = process.env.OPENAI_API_KEY!;
  } else if (type === LLMProvider.Google) {
    apiKey = process.env.GOOGLE_API_KEY!;
  }

  if (!apiKey) {
    throw new Error(`API key not found for provider ${type}`);
  }

  // Use selected model or fall back to defaults
  let model!: string;
  if (selectedModel) {
    model = selectedModel;
  } else if (type === LLMProvider.Anthropic) {
    model = AnthropicModels['claude-sonnet-4.5'];
  } else if (type === LLMProvider.Grok) {
    model = GrokModels['grok-4'];
  } else if (type === LLMProvider.OpenAI) {
    model = OpenAIModels["gpt-4o"];
  } else if (type === LLMProvider.Google) {
    model = GoogleModels['gemini-2.5'];
  }

  if (!model) {
    throw new Error(`Model ${selectedModel} is not supported for provider ${type}`);
  }

  const options: any = {
    apiKey,
    model,
    signal: abortController.signal,
    maxTokens: process.env.MAX_TOKENS && !isGod ? parseInt(process.env.MAX_TOKENS) : 64000,
    tools: activeTools
  };
  const hash = new SHA512();
  hash.update(
    Uint8Array.from(
      Buffer.from(
        JSON.stringify(options)
      )
    )
  )
  const hashId = hash.digest();
  const threadId = Buffer.from(hashId).toString('hex')
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Thread-Id': threadId
  });



  const agent = await AutomatedEngineer.create(
    type,
    {
      ...options,
      onTool: function onTool(
        this: BaseAgent,
        message: Message,
      ) {
        return SystemOnTool.bind(agent)(
          currentUser.id,
          threadId,
          message,
          abortController
        )
      }
    },
    directory,
    inputs,
  );
  const { response } = await agent.performTask(prompt);
  return {
    stream: response,
    hash: hashId
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  res.setHeader("Access-Control-Expose-Headers", "X-Thread-Id")
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  await db.connect()
  const rawBody = req.body;
  const currentUser = await getSessionUser(req, res)
  if (!currentUser) {
    return res.status(403).end('Invalid session or auth token');
  }
  const abortController = new AbortController();
  res.on('close', () => {
    abortController.abort();
    console.log('Client disconnected, aborting stream');
  });
  const { provider } = req.query;
  const parsedBody = JSON.parse(rawBody.toString());

  try {
    const inputs = (parsedBody.inputs ?? []).map((input) => {
      if (typeof input === "string") {
        return JSON.parse(input)
      }
      return input
    });
    const { prompt, directory, tools, model } = parsedBody;
    const gods = process.env.GODS ? process.env.GODS.split(",").map((e) => e.trim()) : [];
    const email = currentUser.email
    const isGod = gods.includes(email);
    const safeInputs = new MessageArray<MessageInput>(inputs)
    if (!prompt) {
      throw new Error('No prompt provided');
    }
    const { stream, hash } = await AutomatedEngineerTask(
      toProvider(provider),
      res,
      currentUser,
      abortController,
      safeInputs,
      isGod,
      directory,
      prompt,
      model,
      tools
    )
    const reader = stream.getReader();
    const threadId = Buffer.from(hash).toString('hex')
    await ensureUserExists(
      {
        email: email,
        name: currentUser.name
      }
    )

    let usageMessage: Message | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      };
      const content = value.content ?? [];

      const hasUsage = content.find((content) => content.type === "usage");
      const hasDelta = content.find((content) => content.type === "delta");


      const chunkContent = content.filter((content) => content.type !== "usage" && content.type !== "delta");
     if (chunkContent.length) {
      const encoded = JSON.stringify({
        ...value,
        content: chunkContent
      });
      res.write(encoded.toString() + SEPARATOR);
     }

     
      if (hasUsage) {
        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
          throw new Error("Unexpected user not found")
        }
        await createUsage(
          existingUser,
          threadId,
          hasUsage.input,
          hasUsage.output
        )
        usageMessage = {
          ...value,
          type: 'usage',
          content: [hasUsage]
        };
      }

      if (hasDelta) {
        const stopReason = hasDelta.stop_reason;
        console.log("Stream ended:", stopReason);

        if (usageMessage) {
          const encoded = JSON.stringify(usageMessage);
          res.write(encoded.toString() + SEPARATOR);
        }

        if (stopReason === "end_turn" || stopReason === "max_tokens") {
          break;
        }
      }

    }
    res.end();
  } catch (error) {
    console.error("Error:", error);
    const errorBlock: ErrorBlock = {
      type: 'error',
      message: (error as Error).message
    };
    const chunk = Buffer.from(JSON.stringify(errorBlock))
    res.write(chunk.toString() + SEPARATOR);
    res.end();
  }
}