/// <reference lib="webworker" />

import { Agent } from '@uaito/ai';
import { HuggingFaceONNX, HuggingFaceONNXTextToAudio, HuggingFaceONNXTextToImage } from '@uaito/huggingface';
import type { HuggingFaceONNXOptions } from '@uaito/huggingface';
import { Message, MessageArray, MessageInput, ToolResultBlock, ToolUseBlock } from '@uaito/sdk';
import type { OnTool } from '@uaito/sdk';
import type { WorkerCommand, WorkerEvent, InitPayload, PerformTaskPayload } from './types';
import { v4 } from 'uuid';

// Required for TS in worker modules
export {}; // ensure this file is a module

// State per worker (reused across requests)
let baseOptions: Omit<HuggingFaceONNXOptions, 'signal' | 'onProgress'> | null = null;

// Per-request controllers
const controllers = new Map<string, AbortController>();

function post(event: WorkerEvent) {
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(event);
}

self.addEventListener('message', async (e: MessageEvent<WorkerCommand>) => {
  const msg = e.data;
  try {
    if (msg.type === 'init') {
      const { requestId, payload } = msg;
      const { model, dtype, device, tools } = payload as InitPayload;
      baseOptions = { model, dtype, device, tools, log: () => {}} as HuggingFaceONNXOptions;
      post({ type: 'ready', requestId });
      return;
    }

    if (msg.type === 'performTask') {
      const { requestId, payload } = msg;
      if (!baseOptions) throw new Error('Worker not initialized. Send init first.');

      const ac = new AbortController();
      controllers.set(requestId, ac);
      const onProgressFor = (modelName: string) => (progress: number) => {
        post({ type: 'progress', requestId, progress, message: `Downloading ${modelName}` });
      };
      const imageLLM = new HuggingFaceONNXTextToImage({ options: { ...baseOptions, signal: ac.signal, onProgress: onProgressFor("Image Generation Model") } });
      const audioLLM = new HuggingFaceONNXTextToAudio({ options: { ...baseOptions, signal: ac.signal, onProgress: onProgressFor("Audio Generation Model") } });
      let llm: HuggingFaceONNX;
      const onTool: OnTool = async function(message: Message) {
        const toolUse = message.content.find((c: any) => c?.type === 'tool_use') as ToolUseBlock | undefined;
        if (!toolUse) return;
        const handleTool = async (
          llmInstance: HuggingFaceONNXTextToImage | HuggingFaceONNXTextToAudio,
          input: { prompt: string },
          modelLabel: string
        ) => {
          const { response } = await new Agent(llmInstance).performTask(input.prompt);
          const toolResultBlock = {
            name: toolUse.name,
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: [],
          } as ToolResultBlock
          for await (const chunk of response) {
            for (const content of chunk.content) {
              toolResultBlock.content?.push(content);
            }
          }
          this.inputs.push({
            role: 'user',
            content: [
                toolResultBlock,
            ],
          });
          // Ensure progress bar completes and fades out
          post({ type: 'progress', requestId, progress: 100, message: `Downloading ${modelLabel}` });
        };
        if (toolUse.name === 'generateImage') {
          await handleTool(imageLLM, toolUse.input as { prompt: string }, 'Image Generation Model');
          return;
        }
        if (toolUse.name === 'generateAudio') {
          await handleTool(audioLLM, toolUse.input as { prompt: string }, 'Audio Generation Model');
          return;
        }
      };
      llm = new HuggingFaceONNX({ options: { ...baseOptions, signal: ac.signal, onProgress: onProgressFor(baseOptions.model as string), onTool } });
      const agent = new Agent(llm);
      const { prompt, inputs } = payload as PerformTaskPayload;
      if (inputs && Array.isArray(inputs)) {
        await agent.addInputs(MessageArray.from(inputs as MessageInput[]));
      }

      await agent.load();
      const { response } = await agent.performTask(prompt as any);

      // Stream back every chunk as it arrives
      const reader = response.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!value) continue;
          post({ type: 'message', requestId, message: value });
        }
        post({ type: 'done', requestId });
      } catch (err) {
        post({ type: 'error', requestId, error: (err as Error)?.message ?? 'unknown error' });
      } finally {
        reader.releaseLock();
        controllers.delete(requestId);
      }
      return;
    }

    if (msg.type === 'cancel') {
      const { requestId } = msg;
      const ac = controllers.get(requestId);
      if (ac) ac.abort();
      controllers.delete(requestId);
      return;
    }

    if (msg.type === 'dispose') {
      controllers.forEach((c) => c.abort());
      controllers.clear();
      baseOptions = null;
      return;
    }
  } catch (err) {
    post({ type: 'error', requestId: (e.data as any)?.requestId ?? 'unknown', error: (err as Error)?.message ?? 'unknown error' });
  }
});
