import { createHuggingFaceWorker } from './createHuggingFaceWorker';
import type { WorkerCommand, WorkerEvent, InitPayload, PerformTaskPayload } from './types';
import { streamFromWorker } from './workerStream';
import type { Message } from '@uaito/sdk';
import { pushChatMessage } from '@/redux/userSlice';
import type { AppDispatch } from '@/redux/store';
import type { Session } from 'next-auth';

type WorkerStatus = 'initializing' | 'ready' | 'error';

export class HuggingFaceWorkerClient {
    private worker: Worker;
    private status: WorkerStatus = 'initializing';
    private readyPromise: Promise<void>;
    private initPayload: InitPayload;

    constructor(initPayload: InitPayload) {
        this.initPayload = initPayload;
        this.worker = createHuggingFaceWorker();
        this.readyPromise = this.init();
    }

    private init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const initId = crypto.randomUUID();

            const onReady = (evt: MessageEvent<any>) => {
                if (evt.data?.type === 'ready' && evt.data?.requestId === initId) {
                    cleanUp();
                    this.status = 'ready';
                    resolve();
                }
            };
            
            const onError = (evt: MessageEvent<any>) => {
                 if (evt.data?.type === 'error' && evt.data?.requestId === initId) {
                    cleanUp();
                    this.status = 'error';
                    reject(new Error(evt.data.error));
                }
            }

            const cleanUp = () => {
                this.worker.removeEventListener('message', onReady);
                this.worker.removeEventListener('message', onError);
            };

            this.worker.addEventListener('message', onReady);
            this.worker.addEventListener('message', onError);

            const initMsg: WorkerCommand = {
                type: 'init',
                requestId: initId,
                payload: this.initPayload,
            };
            this.worker.postMessage(initMsg);
        });
    }

    public getStatus(): WorkerStatus {
        return this.status;
    }

    public async ensureReady(): Promise<void> {
        if (this.status === 'ready') {
            return Promise.resolve();
        }
        return this.readyPromise;
    }

    public async performTask(
        payload: PerformTaskPayload, 
        dispatch: AppDispatch,
        chatId: string,
        session: Session,
        signal?: AbortSignal
    ): Promise<void> {
        await this.ensureReady();

        const requestId = crypto.randomUUID();

        const onProgress = (evt: MessageEvent<WorkerEvent>) => {
            const data = evt.data;
            if (!data || data.type !== 'progress' || data.requestId !== requestId) return;
            const progressMessage = {
                id: `progress-${data.requestId}-${data.message ?? 'default'}`,
                role: 'assistant',
                type: 'progress' as const,
                content: [{ type: 'progress' as const, progress: data.progress, message: data.message ?? 'Downloading model...' }],
            } satisfies Message;
            dispatch(
                pushChatMessage({
                    chatId,
                    session,
                    chatMessage: { message: progressMessage },
                }),
            );
        };

        this.worker.addEventListener('message', onProgress);

        try {
            const delimiter = '<-[*0M0*]->';
            const performCmd: WorkerCommand = {
                type: 'performTask',
                requestId,
                payload,
            };
            this.worker.postMessage(performCmd);

            if (signal) {
                const onAbort = () => {
                    const cancelCmd: WorkerCommand = { type: 'cancel', requestId };
                    this.worker.postMessage(cancelCmd);
                };
                signal.addEventListener('abort', onAbort, { once: true });
            }

            const uint8ArrayStream = streamFromWorker(this.worker, requestId, delimiter);
            await processStream(uint8ArrayStream, chatId, session, dispatch);
        } finally {
            this.worker.removeEventListener('message', onProgress);
        }
    }
    
    public terminate() {
        this.worker.terminate();
    }
}

async function processStream(
	stream: ReadableStream<Uint8Array>,
	chatId: string,
	session: Session,
	dispatch: AppDispatch,
) {
	let buffer = "";
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	const delimiter = "<-[*0M0*]->";
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		buffer += decoder.decode(value, { stream: true });
		let delimiterIndex: number | undefined;
		while ((delimiterIndex = buffer.indexOf(delimiter)) !== -1) {
			const message = buffer.slice(0, delimiterIndex);
			buffer = buffer.slice(delimiterIndex + delimiter.length);
			if (message) {
				try {
					const parsed: Message = JSON.parse(message);
					dispatch(
						pushChatMessage({
							chatId,
							session,
							chatMessage: { message: parsed },
						}),
					);
				} catch (err) {
					console.error("Failed to parse message:", err);
				}
			}
		}
	}
	reader.cancel();
	reader.releaseLock();
}

const clients = new Map<string, HuggingFaceWorkerClient>();

export function getWorkerClient(provider: string, agent: string, model: string) {
    const key = `${provider}-${agent}-${model}`;
    if (!clients.has(key)) {
        const initPayload: InitPayload = {
            model: model ?? 'onnx-community/Janus-Pro-1B-ONNX',
            dtype: 'q4f16',
            device: typeof navigator !== 'undefined' && (navigator as any).gpu ? 'webgpu' : 'wasm',
            tools: [
                {
                    name: 'generateImage',
                    description: 'Generate an image based on a prompt (returns blob URL inside <image> tag).',
                    input_schema: {
                        type: 'object',
                        properties: {
                            prompt: { type: 'string', description: 'Image prompt' },
                        },
                        required: ['prompt'],
                    },
                },
                {
                    name: 'generateAudio',
                    description: 'Generate audio based on a prompt (returns blob URL inside <audio> tag).',
                    input_schema: {
                        type: 'object',
                        properties: {
                            prompt: { type: 'string', description: 'Audio prompt' },
                        },
                        required: ['prompt'],
                    },
                },
            ],
        };
        clients.set(key, new HuggingFaceWorkerClient(initPayload));
    }
    return clients.get(key)!;
}
