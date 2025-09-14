import { LLMProvider, Message, MessageArray, MessageInput } from '@uaito/sdk';

export interface UaitoClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface ChatOptions {
  provider: LLMProvider;
  agent: string;
  model?: string;
  inputs?: MessageArray<MessageInput>;
  signal?: AbortSignal;
}

export {LLMProvider} from '@uaito/sdk';

export class UaitoClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(options: UaitoClientOptions) {
    if (!options.apiKey) {
      throw new Error('API key is required.');
    }
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || 'http://localhost:3000';
  }

  async *chat(prompt: string, options: ChatOptions): AsyncGenerator<Message> {
    const { provider, agent, model, inputs, signal } = options;
    const url = `${this.baseUrl}/api/${provider}/${agent}/messages`;

    const body = {
      prompt,
      inputs: inputs ? inputs.map((i) => (typeof i.content === 'string' ? { ...i, content: [{ type: 'text', text: i }] } : i)) : [],
      model,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': this.apiKey,
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error('Response body is empty.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    const delimiter = "<-[*0M0*]->";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      
      let delimiterIndex: number;
      // biome-ignore lint/suspicious/noAssignInExpressions:ok
      while ((delimiterIndex = buffer.indexOf(delimiter)) !== -1) {
        const message = buffer.slice(0, delimiterIndex);
        buffer = buffer.slice(delimiterIndex + delimiter.length);
        
        if (message) {
          try {
            const parsed: Message = JSON.parse(message);
            yield parsed;
          } catch (err) {
            console.error("Failed to parse message:", err);
          }
        }
      }
    }
  }
}
