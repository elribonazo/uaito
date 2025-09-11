import type { NextApiRequest, NextApiResponse } from 'next';
import { AbortController } from 'abort-controller';
import NextCors from 'nextjs-cors';
import {SHA512} from '@stablelib/sha512';
import { Agent, AnthropicModels, AnthropicOptions, ErrorBlock, LLMProvider, Message, MessageArray, MessageInput, OpenAIModels, TextBlock, Tool } from '@uaito/sdk';
import { browseWebPageTool, createFileTool, createFolderTool, editAndApplyTool, executeCommandTool, readFileTool, tavilySearch } from '@/ai/tools';
import { findUserByEmail, IUser } from "@/db/models/User"
import { createUsage } from '@/db/models/Usage';
import { getSessionUser } from '@/utils/getSessionUser';
import db from '@/db';
import { AutomatedEngineer } from '@/ai/agents/AutomatedEngineer';
import { createChainOfThought } from '@/ai/prompts/AutomatedEngineer';
import { onTool as SystemOnTool } from '../../../../ai/agents/onTool';
import { ensureUserExists } from '../../auth/[...nextauth]';

const SEPARATOR = "<-[*0M0*]->"

function toProvider(p: string | string[] | undefined): LLMProvider {
  const s = Array.isArray(p) ? p[0] : p;
  switch (s) {
    case 'OpenAI':
      return LLMProvider.OpenAI;
    case 'Anthropic':
      return LLMProvider.Anthropic;
    case 'HuggingFaceONNX':
      return LLMProvider.HuggingFaceONNX;
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
):Promise<{hash: Uint8Array, stream:ReadableStream<Message>}> {
  const availableTools = tools && Array.isArray(tools) ? 
  tools: directory ? [
    createFolderTool,
    createFileTool,
    editAndApplyTool,
    readFileTool,
    browseWebPageTool,
    tavilySearch,
    executeCommandTool,
  ]: [
    browseWebPageTool,
    tavilySearch,
  ];
  const chainOfThought = createChainOfThought(availableTools);
  const activeTools = availableTools.map((tool) => {
    const {name, description, input_schema} = tool;
    return {name, description, input_schema}
  })
  const apiKey = type === LLMProvider.Anthropic ? process.env.ANTHROPIC_API_KEY :  process.env.OPENAI_API_KEY;
  
  // Use selected model or fall back to defaults
  let model: string;
  if (selectedModel) {
    model = selectedModel;
  } else {
    model = type === LLMProvider.Anthropic ? AnthropicModels['claude-4-sonnet'] : OpenAIModels["gpt-4o"];
  }
  const options: AnthropicOptions = {
    apiKey: apiKey,
    model,
    signal: abortController.signal,
    maxTokens: process.env.MAX_TOKENS && !isGod ?parseInt(process.env.MAX_TOKENS): 8192,
    tools:activeTools
  };
  const hash = new SHA512();
  hash.update(
    Uint8Array.from(
      Buffer.from(
        JSON.stringify(options)
      )
    )
  )
  const hashId =  hash.digest();
  const threadId = Buffer.from(hashId).toString('hex')
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Thread-Id': threadId
  });
  const agent = new AutomatedEngineer(
    type,
    options,
    function onTool(
      this: Agent<LLMProvider.Anthropic>,
      message: Message,
    )  {
        return SystemOnTool.bind(this)(
          currentUser.id,
          threadId,
          message,
          this.inputs, 
          abortController
        )
      },
    directory,
    inputs,
    chainOfThought
  );
  const { response } = await agent.performTask(prompt, '', chainOfThought, true);
  return {
    stream:response,
    hash:hashId
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  res.setHeader("Access-Control-Expose-Headers","X-Thread-Id")
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
    const inputs = (parsedBody.inputs ?? []).map((input ) => {
      if (typeof input === "string") {
        return JSON.parse(input)
      }
      return input
    });
    const { prompt, directory, tools, model } = parsedBody;
    const gods = process.env.GODS ? process.env.GODS.split(",").map((e) => e.trim()): [];
    const email = currentUser.email
    const isGod = gods.includes(email);
    const safeInputs = new MessageArray<MessageInput>(inputs)


      if (!prompt) {
        throw new Error('No prompt provided');
      }
      const {stream, hash} = await AutomatedEngineerTask(
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
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          };
          const usage = (value?.content?? []).find((content) => content.type === "usage");
          if (usage ) {
            const existingUser = await findUserByEmail(email);
            if (!existingUser) {
              throw new Error("Unexpected user not found")
            }
            await createUsage(
              existingUser,
              threadId,
              usage.input,
              usage.output
            )
          }
          const chunk = JSON.stringify(value);
          res.write(chunk.toString() +  SEPARATOR);
          if (value.type === "delta") {
            const deltaBlock = value.content.find((block) => block.type === "delta");
            if (deltaBlock) {
              const stopReason = deltaBlock.stop_reason;
              console.log("Stream ended:", stopReason);
              if (stopReason === "end_turn" || stopReason === "max_tokens") {
                break;
              }
            }
          }
        
      }
      } catch (err) {
        //ignore for now
      }
     
  } catch (error) {
    console.error("Error:", error);
    const errorBlock: ErrorBlock = {
      type: 'error',
      message: (error as Error).message
    };
    const chunk = Buffer.from(JSON.stringify(errorBlock))
    res.write(chunk.toString() +  SEPARATOR);
  } finally {
    res.end();
  }
}