/** biome-ignore-all lint/suspicious/noAssignInExpressions: ok */
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "@/redux/store";
import type { Session } from "next-auth";
import { LLMProvider,  Message, MessageArray, MessageInput, BlockType } from "@uaito/sdk";
import { v4 } from "uuid";
import { pushChatMessage } from "@/redux/userSlice";
import { getWorkerClient } from '@/workers/workerClient';

interface StreamInput {
	chatId: string;
	agent?: string;
	session: Session;
	prompt: string | BlockType[];
	inputs: MessageArray<MessageInput>;
	signal: AbortSignal;
	provider?: LLMProvider;
	model?: string;
	dispatch: AppDispatch;
}

const withWebGPU = [LLMProvider.Local];

async function processHttpStream(
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

export const getApiKey = createAsyncThunk(
	"user/key",
	async (_options: unknown, { fulfillWithValue, rejectWithValue }) => {
		try {
			const response = await fetch(`/api/key`);
			return fulfillWithValue(response);
		} catch (error) {
			console.log(error);
			return rejectWithValue(
				`An error occurred. Please try again later. ${(error as Error).message}`,
			);
		}
	},
);

export const streamMessage = createAsyncThunk(
	"user/message",
	async (options: StreamInput, { fulfillWithValue, rejectWithValue }) => {
		const { chatId, prompt, inputs, signal, dispatch, session } = options;
		try {
			const provider = options.provider ?? LLMProvider.Local;
			const agent = options.agent ?? "orquestrator";
			const model = options.model ?? 'onnx-community/Janus-Pro-1B-ONNX';

			let userMessage: Message;
			if (typeof prompt === "string") {
				userMessage = {
				role: "user",
				type: "message",
				id: v4(),
					content: [{ type: "text", text: prompt }],
				};
			} else {
				userMessage = {
					role: "user",
					type: "message",
					id: v4(),
					content: prompt,
				};
			}

			dispatch(
				pushChatMessage({
					chatId,
					session,
					chatMessage: {
						message: userMessage,
					},
				}),
			);

			if (!withWebGPU.includes(provider)) {
				const url = agent === 'rag' ? `/api/rag` : `/api/${provider}/${agent}/messages`;
				const response = await fetch(url, {
					method: "POST",
					body: JSON.stringify({
						prompt,
						inputs: inputs.map((i) =>
							typeof i.content === "string"
								? { ...i, content: [{ type: "text", text: i }] }
								: i,
						),
						model,
					}),
					signal,
					credentials: "include",
				});

				if (!response.ok) {
					return rejectWithValue("An error occurred. Please try again later.");
				}
				if (response.body) {
					await processHttpStream(response.body, chatId, session, dispatch);
				}
				return fulfillWithValue({ chatId, requestId: null });
			}
            
            const workerClient = getWorkerClient(provider.toString(), agent, model);

            await workerClient.performTask(
                {
                    prompt,
                    inputs: Array.from(inputs.map((i) => (typeof (i as any).content === 'string' ? { ...i, content: [{ type: 'text', text: i as any }] } : i))),
                },
                dispatch,
                chatId,
                session,
                signal
            );
			return fulfillWithValue({ chatId, requestId: null });

		} catch (error) {
			const err =
				"An error occurred. Please try again later." + (error as Error).message;
			const userMessage: Message = {
				role: "assistant",
				type: "message",
				id: v4(),
				content: [{ type: "text", text: err }],
			};

			dispatch(
				pushChatMessage({
					chatId,
					session: options.session,
					chatMessage: {
						message: userMessage,
					},
				}),
			);
			return rejectWithValue(err);
		}
	},
);


