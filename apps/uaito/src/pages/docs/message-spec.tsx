import { DocsLayout } from '@/components/DocsLayout';
import dynamic from 'next/dynamic';

const Code = dynamic(() => import('@/components/Code').then((e) => e.Code), { ssr: false });

function MessageSpecPage() {
  return (
    <DocsLayout>
      <h1>Message Specification</h1>
      <p>The SDK uses a standardized \`Message\` object for all communications. Understanding its structure is key to working with the SDK effectively.</p>

      <h2>Base \`Message\` Object</h2>
      <Code language="typescript">{`
export type Message = {
  id: string,
  type: MessageType,
  content: BlockType[],
  chunk?: boolean,
  role: Role
}
      `}</Code>
      <ul>
        <li><strong>id:</strong> A unique identifier for the message.</li>
        <li><strong>type:</strong> The type of the message, which determines the structure of the \`content\`.</li>
        <li><strong>content:</strong> An array of content blocks.</li>
        <li><strong>chunk:</strong> An optional boolean indicating if this is a streaming chunk.</li>
        <li><strong>role:</strong> The role of the message sender, can be 'user', 'assistant', 'system', or 'tool'.</li>
      </ul>

      <h2>Content Blocks (\`BlockType\`)</h2>
      <p>The \`content\` array can contain various types of blocks, grouped into several categories.</p>
      
      <h3>Basic Content Blocks</h3>
      <p>These blocks represent the fundamental content of a message.</p>

      <h4>TextBlock</h4>
      <p>For plain text content.</p>
      <Code language="typescript">{`
export type TextBlock = {
  text: string;
  type: 'text';
}
      `}</Code>
      
      <h4>ImageBlock</h4>
      <p>For image content, typically used in multimodal scenarios.</p>
      <Code language="typescript">{`
export type ImageBlock = {
  source: {
    data: string; // base64 encoded image
    media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    type: 'base64';
  };
  type: 'image';
}
      `}</Code>

      <h4>AudioBlock</h4>
      <p>For audio content.</p>
      <Code language="typescript">{`
export type AudioBlock = {
  source: {
    data: string; // base64 encoded audio
    media_type: 'audio/wav';
    type: 'base64';
  };
  type: 'audio';
}
      `}</Code>

      <h3>Tool-Related Blocks</h3>
      <p>These blocks are used when interacting with tools.</p>

      <h4>ToolUseBlock</h4>
      <p>Represents a tool call requested by the assistant.</p>
      <Code language="typescript">{`
export type ToolUseBlock = {
  id: string;
  input: unknown;
  name: string;
  type: 'tool_use';
}
      `}</Code>

      <h4>ToolResultBlock</h4>
      <p>Represents the result of a tool execution.</p>
      <Code language="typescript">{`
export type ToolResultBlock = {
  tool_use_id: string;
  name: string,
  type: 'tool_result';
  content?: MessageContent[];
  isError?: boolean;
}
      `}</Code>

      <h4>ToolInputDelta</h4>
      <p>Represents a partial tool input for streaming.</p>
      <Code language="typescript">{`
export type ToolInputDelta = {
  id?:string,
  name?:string,
  partial:string,
  type: 'tool_delta';
}
      `}</Code>

      <h4>ServerToolUseBlock</h4>
      <p>Represents a server-side tool call, like web search.</p>
      <Code language="typescript">{`
export interface ServerToolUseBlock {
  id: string;
  input: unknown;
  name: 'web_search';
  type: 'server_tool_use';
}
      `}</Code>

      <h4>WebSearchToolResultBlock</h4>
      <p>Represents the result of a web search tool execution.</p>
      <Code language="typescript">{`
export interface WebSearchToolResultBlock {
  content: WebSearchToolResultBlockContent;
  tool_use_id: string;
  type: 'web_search_tool_result';
}

// content can be one of:
export type WebSearchToolResultBlockContent = WebSearchToolResultError | Array<WebSearchResultBlock>;
      `}</Code>
      
      <h3>Streaming and Metadata Blocks</h3>
      <p>These blocks provide metadata or handle streaming.</p>

      <h4>DeltaBlock</h4>
      <p>Indicates the reason a stream has stopped.</p>
      <Code language="typescript">{`
export type DeltaBlock = {
  type:'delta',
  stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null;
  stop_sequence: string | null;
}
      `}</Code>

      <h4>UsageBlock</h4>
      <p>Provides information about token usage for a request.</p>
      <Code language="typescript">{`
export type UsageBlock = {
  type: 'usage',
  input?: number,
  output?: number
}
      `}</Code>

      <h4>ThinkingBlock</h4>
      <p>Represents the thought process of the agent.</p>
      <Code language="typescript">{`
export interface ThinkingBlock {
  signature: string;
  thinking: string;
  type: 'thinking';
}
      `}</Code>

      <h4>RedactedThinkingBlock</h4>
      <p>A redacted version of the agent's thought process.</p>
      <Code language="typescript">{`
export interface RedactedThinkingBlock {
  data: string;
  type: 'redacted_thinking';
}
      `}</Code>
      
      <h4>SignatureDeltaBlock</h4>
      <p>A streaming delta for a signature.</p>
      <Code language="typescript">{`
export interface SignatureDeltaBlock {
  signature: string;
  type: 'signature_delta';
}
      `}</Code>

      <h3>Error Handling</h3>
      <h4>ErrorBlock</h4>
      <p>Represents an error that occurred.</p>
      <Code language="typescript">{`
export type ErrorBlock = {
  type:'error',
  message: string
}
      `}</Code>

    </DocsLayout>
  );
}

export default MessageSpecPage;
