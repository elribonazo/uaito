import { BlockType, MessageInput } from "@uaito/sdk";

export type WorkerCommand =
  | { type: 'init'; requestId: string; payload: InitPayload }
  | { type: 'performTask'; requestId: string; payload: PerformTaskPayload }
  | { type: 'cancel'; requestId: string }
  | { type: 'dispose'; requestId: string };

export type WorkerEvent =
  | { type: 'ready'; requestId: string }
  | { type: 'progress'; requestId: string; progress: number; message?: string }
  | { type: 'message'; requestId: string; message: unknown }
  | { type: 'done'; requestId: string }
  | { type: 'error'; requestId: string; error: string };

export type InitPayload = {
  model: string;
  dtype?: 'auto' | 'q4f16' | 'fp16' | string;
  device?: 'webgpu' | 'wasm';
  tools?: unknown[]; // reuse @uaito/sdk Tool type at call site
};

export type PerformTaskPayload = {
  prompt: string | BlockType[]; // Message BlockType[]
  inputs?: MessageInput[]; // MessageInput[]
};
