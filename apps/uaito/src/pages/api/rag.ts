import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { SHA512 } from '@stablelib/sha512';
import { ErrorBlock, LLMProvider, Message, MessageArray, MessageInput, BaseAgent } from '@uaito/sdk';
import { IUser } from "@/db/models/User"
import { createUsage } from '@/db/models/Usage';
import { getSessionUser } from '@/utils/getSessionUser';
import db from '@/db';
import { ensureUserExists } from '@/pages/api/auth/[...nextauth]';
import { OpenAIModels, OpenAIOptions } from '@uaito/openai';
import { RAGAgent, RAGAgentOptions } from '@/ai/agents/RAGAgent';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = util.promisify(exec);


const SEPARATOR = "<-[*0M0*]->"

async function RAGTask(
  res: NextApiResponse,
  abortController: AbortController,
  inputs: MessageArray<MessageInput>,
  prompt: string,
  selectedModel?: string,
  ragOptions?: RAGAgentOptions
): Promise<{ hash: Uint8Array, stream: ReadableStream<Message> }> {

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(`API key not found for provider OpenAI`);
  }

  const model = (selectedModel || OpenAIModels['gpt-5-pro']) as OpenAIModels
 
  const options: OpenAIOptions<LLMProvider.OpenAI> = {
    type: LLMProvider.OpenAI,
    apiKey,
    model,
    signal: abortController.signal,
    maxTokens:undefined
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

  const agent = await RAGAgent.create(
    options,
    inputs,
    ragOptions || {}
  );
  const { response } = await agent.performTask(`${prompt}.`);
  return {
    stream: response,
    hash: hashId
  }
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
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

  const parsedBody = JSON.parse(rawBody.toString());
  try {
    const inputs = (parsedBody.inputs ?? []).map((input: any) => {
      if (typeof input === "string") {
        return JSON.parse(input)
      }
      return input
    });
    const { prompt, model, repoUrl, repomixInclude, repomixIgnore, agentRole, projectName, projectImportPath } = parsedBody;
    const email = currentUser.email
    const safeInputs = new MessageArray<MessageInput>(inputs)
    if (!prompt) {
      throw new Error('No prompt provided');
    }
    const { stream, hash } = await RAGTask(
      res,
      abortController,
      safeInputs,
      prompt,
      model,
      {
        repoUrl,
        repomixInclude,
        repomixIgnore,
        agentRole,
        projectName,
        projectImportPath
      }
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
      if (!value) continue;
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
        await createUsage(
          currentUser,
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
