
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Session } from "next-auth";
import { Agent, HuggingFaceONNXModels, HuggingFaceONNXOptions, LLMProvider, Message, MessageArray, MessageInput } from "@uaito/sdk";
import { v4 } from 'uuid';

import type { AppDispatch } from "@/redux/store";
import { pushChatMessage, setDownloadProgress } from "@/redux/userSlice";

interface StreamInput {
  agent?: string,
  session: Session,
  prompt: string,
  inputs: MessageArray<MessageInput>,
  signal: AbortSignal,
  provider?: LLMProvider,
  model?: string,
  dispatch: AppDispatch
}

const withWebGPU = [
  LLMProvider.HuggingFaceONNX
]


async function processStream(
  stream: ReadableStream<Uint8Array<ArrayBuffer>>,
  session: Session,
  dispatch: AppDispatch
) {
  let buffer = '';
  const reader = stream.getReader();
  let completed = false;
  while (!completed) {
    const { done, value } = await reader.read();
    if (done) {
      completed = true;
      break;
    }
    const json = Buffer.from(value).toString('utf-8')
    const messages = json.split("<-[*0M0*]->")
    while(messages.length) {
        const [message] = messages.splice(0,1);
        if (message) {
          try {
            const parsed: Message = JSON.parse(buffer+message)
            dispatch(
              pushChatMessage({
                session,
                chatMessage: {
                  message:parsed
                }
              })
            )
            buffer = ''
          } catch (err) {
            buffer += message
          }
        }
    }
  }
  reader.releaseLock()
}


export const getApiKey =  createAsyncThunk(
  'user/key',
  async (options: any, { fulfillWithValue, rejectWithValue }) => {
      try {
        const response = await fetch(`/api/key`);
        return fulfillWithValue(response)
      } catch (error) {
        console.log(error);
        return rejectWithValue(`An error occurred. Please try again later. ${(error as Error).message}`);
      }
  })


export const streamMessage = createAsyncThunk(
  'user/message',
  async (options: StreamInput, { fulfillWithValue, rejectWithValue }) => {
    const {
      prompt,
      inputs,
      signal,
      dispatch,
    } = options;
    try {
      const provider = options.provider ?? LLMProvider.HuggingFaceONNX;
      const agent = options.agent ?? 'orquestrator';
      const userMessage: Message =  {
        role:'user',
        type:'message',
        id: v4(),
        content: [
          { type:'text', text: prompt }
        ]
      }

      dispatch(
        pushChatMessage({
          session:options.session,
          chatMessage: {
            message: userMessage,
          }
        })
      )
      
      if (!withWebGPU.includes(provider)) {
        const url = `/api/${provider}/${agent}/messages`
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ 
            prompt,  
            inputs: inputs.map((i) => typeof i.content === 'string'? {...i, content:[{type: 'text', text:i}]}: i),
            model: options.model
          }),
          signal: signal,
          credentials: 'include'
        });

        if (!response.ok) {
          return rejectWithValue('An error occurred. Please try again later.');
        }
        if (response.body) {
          await processStream(response.body, options.session, dispatch)
        }
        return fulfillWithValue(null)
      }

      // Throttle progress updates to reduce dispatch frequency
      let lastProgressDispatch = 0;
      const PROGRESS_THROTTLE_MS = 100; // Dispatch at most every 100ms

      // Use selected model or default to QWEN_1
      const selectedModel = options.model ? options.model as HuggingFaceONNXModels : HuggingFaceONNXModels.QWEN3;
      
      const device = (typeof navigator !== 'undefined' && (navigator as any).gpu) ? "webgpu" : "wasm";

      const hfOptions: HuggingFaceONNXOptions = {
        model: selectedModel,
        dtype: "q4f16",
        device,
        tools: [],
        signal: signal as any,
        onProgress: (progress) => {
          const now = Date.now();
          // Only dispatch if enough time has passed or if progress is complete (100%)
          if (now - lastProgressDispatch >= PROGRESS_THROTTLE_MS || progress >= 100) {
            dispatch(setDownloadProgress(progress));
            lastProgressDispatch = now;
          }
        }
      };

      dispatch(setDownloadProgress(0));

      const __agent = new Agent(
        LLMProvider.HuggingFaceONNX, 
        hfOptions,       
        async function (this: Agent<typeof provider>, message: Message, _signal) { }
      );

      const { response } = await __agent.performTask(
        prompt,
        '',
        `Your name is Uaito.
You are an advanced AI assistant equipped with specialized tools to enhance query resolution. Your responses should be concise, helpful, and factually accurate.

### Key Guidelines
- **Internal Knowledge First**: Only use tools if the user's request explicitly requires information, computation, data retrieval, or verification that exceeds your internal knowledge or capabilities. For questions you can answer directly from your training data (up to your knowledge cutoff), respond immediately without tools.
- **Step-by-Step Reasoning**: For every user query, think step-by-step in your internal reasoning (enclosed in <thinking> tags, which are not shown to the user). Analyze the query, check conversation history for context, determine if tools are strictly necessary, and plan your approach. If tools are needed, select the most relevant one(s) and explain why in your thinking.
- **Conversation History**: Always reference the full conversation history, including past user messages, your responses, tool calls, and their results. Use this to maintain context, chain operations logically, avoid redundant tool calls, and build on previous steps. If a similar tool was used recently and its result is still valid/relevant, reference it instead of re-running unless the query demands fresh data or recomputation.
- **Multi-Step Processes**: Break down complex queries into sequential steps. Use tools iteratively across turns if needed (e.g., use one tool's output as input for another). Do not attempt to resolve everything in one response if it requires chaining.
- **Efficiency and Relevance**: Prioritize the fewest, most targeted tool calls. Invoke multiple tools in parallel only if they provide independent value without overlap. Craft precise arguments to get focused outputs.
- **Error Handling**: If a tool returns an error, describe the issue clearly in your response, suggest alternatives (e.g., rephrasing the query or using a different tool), and do not fabricate results.
- **Final Response**: After reasoning (and any tool calls), provide a direct, user-facing answer. If tools were used, incorporate their results seamlessly without mentioning the tools unless relevant to the explanation.

### Tool Usage Format
To use tools, output function calls in this exact XML format before your final response. Use <tool_call> and </tool_call> tags. You can call multiple tools in sequence or parallel by listing them one after another.
Do not escape arguments; they are parsed as plain text. After tool results are provided (in the next system message), continue reasoning based on them and output your final response without further tool calls unless needed.

If no tools are required, skip tool calls and go straight to your response.

### Response Structure
- Start with <think>your step-by-step reasoning here</think> (internal only).
- If using tools, output the tool call(s) immediately after thinking.
- After tool results (in subsequent interactions), end with your final, user-facing response. Do not include thinking or tool calls in the final output to the user.

Maintain neutrality, avoid verbosity, and focus on delivering value.`,
        true
      );
      
      // Convert ReadableStream<Message> to ReadableStream<Uint8Array>
      const uint8ArrayStream = new ReadableStream<any>({
        start: async (controller) => {
          const reader = response.getReader();
          
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                break;
              }

              
              // Serialize the Message to JSON and encode as Uint8Array
              const jsonString = JSON.stringify(value) + "<-[*0M0*]->";
              const uint8Array = new TextEncoder().encode(jsonString);
              controller.enqueue(uint8Array);
            }
          } catch (error) {
            controller.error(error);
          }
        }
      });

      await processStream(uint8ArrayStream, options.session, dispatch)

      return fulfillWithValue(1)
    } catch (error) {
      const err = 'An error occurred. Please try again later.' + (error as Error).message
      const userMessage: Message =  {
        role:'assistant',
        type:'message',
        id: v4(),
        content: [
          { type:'text', text: err }
        ]
      }

      dispatch(
        pushChatMessage({
          session:options.session,
          chatMessage: {
            message: userMessage,
          }
        })
      )
      return rejectWithValue(err);
    }
  }
)


