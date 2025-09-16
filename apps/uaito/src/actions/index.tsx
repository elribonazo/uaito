/** biome-ignore-all lint/suspicious/noAssignInExpressions: <explanation> */

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Session } from "next-auth";
import {
	Agent,
	HuggingFaceONNXModels,
	HuggingFaceONNXOptions,
	LLMProvider,
	LOG_ANSI_BLUE,
	Message,
	MessageArray,
	MessageInput,
	OnTool,
	ToolResultBlock,
} from "@uaito/sdk";
import { v4 } from "uuid";

import type { AppDispatch } from "@/redux/store";
import { pushChatMessage, setDownloadProgress } from "@/redux/userSlice";
import {
	EdgeRuntimeAgent,
	EdgeRuntimeAgentImage,
} from "@/ai/agents/EdgeRuntime";

interface StreamInput {
	agent?: string;
	session: Session;
	prompt: string;
	inputs: MessageArray<MessageInput>;
	signal: AbortSignal;
	provider?: LLMProvider;
	model?: string;
	dispatch: AppDispatch;
}

const withWebGPU = [LLMProvider.Local];

async function processStream(
	stream: ReadableStream<Uint8Array>,
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

const agents: Map<string, any> = new Map();

export const streamMessage = createAsyncThunk(
	"user/message",
	async (options: StreamInput, { fulfillWithValue, rejectWithValue }) => {
		const { prompt, inputs, signal, dispatch } = options;
		try {
			const provider = options.provider ?? LLMProvider.Local;
			const agent = options.agent ?? "orquestrator";
			const userMessage: Message = {
				role: "user",
				type: "message",
				id: v4(),
				content: [{ type: "text", text: prompt }],
			};

			dispatch(
				pushChatMessage({
					session: options.session,
					chatMessage: {
						message: userMessage,
					},
				}),
			);

			if (!withWebGPU.includes(provider)) {
				const url = `/api/${provider}/${agent}/messages`;
				const response = await fetch(url, {
					method: "POST",
					body: JSON.stringify({
						prompt,
						inputs: inputs.map((i) =>
							typeof i.content === "string"
								? { ...i, content: [{ type: "text", text: i }] }
								: i,
						),
						model: options.model,
					}),
					signal: signal,
					credentials: "include",
				});

				if (!response.ok) {
					return rejectWithValue("An error occurred. Please try again later.");
				}
				if (response.body) {
					await processStream(response.body, options.session, dispatch);
				}
				return fulfillWithValue(null);
			}

			//WEBGPU AGENTS
			if (!agents.has(`${provider}-${agent}`)) {
				// Throttle progress updates to reduce dispatch frequency
				let lastProgressDispatch = 0;
				const PROGRESS_THROTTLE_MS = 100; // Dispatch at most every 100ms

				// Use selected model or default to QWEN_1
				const selectedModel = options.model
					? (options.model as HuggingFaceONNXModels)
					: HuggingFaceONNXModels.QWEN3;

				const device =
					typeof navigator !== "undefined" && (navigator as any).gpu
						? "webgpu"
						: "wasm";

				const hfOptions: HuggingFaceONNXOptions = {
					model: selectedModel,
					dtype: "q4f16",
					device,
					tools: [
						{
							name: "generateImage",
							description:
								"Generate an image based on a prompt. This tool should be used when you need to generate an image based on a prompt.",
							input_schema: {
								type: "object",
								properties: {
									prompt: {
										type: "string",
										description:
											"A detailed prompt describing the picture, applying the visual style and quality of the picture.",
									},
								},
								required: ["prompt"],
							},
						},
					],
					signal: signal,
					onProgress: (progress) => {
						const now = Date.now();
						// Only dispatch if enough time has passed or if progress is complete (100%)
						if (
							now - lastProgressDispatch >= PROGRESS_THROTTLE_MS ||
							progress >= 100
						) {
							dispatch(setDownloadProgress(progress));
							lastProgressDispatch = now;
						}
					},
				};

				dispatch(setDownloadProgress(0));

				const imageAgent = new EdgeRuntimeAgentImage({});

				const newAgent = new EdgeRuntimeAgent(
					hfOptions,
					async function (this: Agent<LLMProvider.Local>, message: Message) {
						const toolUse = message.content.find((m) => m.type === "tool_use");
						const id = message.id;

						if (toolUse?.name === "generateImage") {
							const input = toolUse?.input as { prompt: string };
							const { response } = await imageAgent.performTask(input.prompt);
							const toolResult: Message = {
								...message,
								id,
								type: "tool_result",
								content: [
									{
										name: (toolUse as any).name,
										type: "tool_result",
										tool_use_id: id,
										content: [],
									} as ToolResultBlock,
								],
								role: "user",
							};
							for await (const chunk of response) {
								for (const content of chunk.content) {
									(toolResult as any).content[0].content.push(content);
								}
							}
							this.client.inputs.push(toolResult);
						} else {
							this.client.inputs.push({
								...message,
								id,
								type: "tool_result",
								content: [
									{
										name: (toolUse as any).name,
										type: "tool_result",
										tool_use_id: id,
										content: [
											{
												type: "text",
												text: "Hello, world!",
											},
										],
									},
								],
								role: "user",
							});
						}
					},
					LOG_ANSI_BLUE,
					"EdgeAgent",
				);


				agents.set(`${provider}-${agent}`, newAgent);
			}

			const __agent: Agent<LLMProvider.Local> = agents.get(
				`${provider}-${agent}`,
			);

      await __agent.load()

      const newInputs = inputs ?? [];
      if (__agent.client.inputs.length === 0 && newInputs.length > 0) {
        await __agent.addInputs(newInputs);
      }

			const { response } = await __agent.performTask(prompt);
			const delimiter = "<-[*0M0*]->";

			// Convert ReadableStream<Message> to ReadableStream<Uint8Array>
			const uint8ArrayStream = new ReadableStream<Uint8Array>({
				start: async (controller) => {
					const reader = response.getReader();
					try {
						while (true) {
							const { done, value } = await reader.read();
							if (done) {
								break;
							}
							if (!value) {
								continue;
							}
							const jsonString = JSON.stringify(value);
							const uint8Array = new TextEncoder().encode(
								jsonString + delimiter,
							);
							controller.enqueue(uint8Array);
						}
						controller.close();
						reader.releaseLock();
					} catch (error) {
						controller.error(error);
					}
				},
			});

			await processStream(uint8ArrayStream, options.session, dispatch);
			return fulfillWithValue(null);
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


