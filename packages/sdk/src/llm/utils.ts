import type { BaseMessage, Tool } from "@/types";
import { ThinkingMessage } from "./parse/ThinkMessage";
import { ToolUseMessage } from "./parse/ToolUseMessage";
import { ImageMessage } from "./parse/ImageMessage";
import { TextMessage } from "./parse/TextMessage";
import { AudioMessage } from "./parse/AudioMessage";

// Verbose logging utility
const log = (message: string, data?: any) => {
  console.log(`[MessageCache] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};


export const blobToDataURL = async (blob: Blob): Promise<string> => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const dataUrl = `data:${blob.type};base64,${buffer.toString("base64")}`;
  return dataUrl;
};


export class MessageCache {
  public currentElement: BaseMessage | null = null;

  constructor(public tools: Tool[]) { }

  async processChunk(chunk: string) {
    log('Processing chunk', { chunkLength: chunk.length, chunkPreview: chunk.substring(0, 100) });
    
    if (!this.currentElement) {
      log('No current element, determining message type');
      //We need to know which type of element it is we are processing
      //thinking, tool_use, etc

      const idxThinking = chunk.indexOf('<thinking>');
      const idxThink = chunk.indexOf('<think>');
      const hasThinkingOpenTags = idxThinking !== -1 || idxThink !== -1;
      if (hasThinkingOpenTags) {
        log('Detected thinking message', { idxThinking, idxThink });
        this.currentElement = new ThinkingMessage(chunk);
        const result = await this.currentElement.render();
        log('ThinkingMessage rendered', { messageId: result.id });
        return result;
      }

      const toolUseOpenTagIndex = chunk.indexOf('<|tool_call_start|>') !== -1 ?
        chunk.indexOf('<|tool_call_start|>') :
        chunk.indexOf('<tool_call>');

      if (toolUseOpenTagIndex !== -1) {
        log('Detected tool use message', { toolUseOpenTagIndex, availableTools: this.tools.length });
        this.currentElement = new ToolUseMessage(chunk, this.tools);
        return null
      }

      const audioOpenTagIndex = chunk.indexOf('<audio>');
      if (audioOpenTagIndex !== -1) {
        log('Detected audio message', { audioOpenTagIndex });
        this.currentElement = new AudioMessage(chunk.replace('<audio>', ''));
        const result = await this.currentElement.render();
        log('AudioMessage rendered', { messageId: result.id });
        this.currentElement = null;
        return result;
      }

      const imageOpenTagIndex = chunk.indexOf('<image>');
      if (imageOpenTagIndex !== -1) {
        log('Detected image message', { imageOpenTagIndex });
        this.currentElement = new ImageMessage(chunk.replace('<image>', ''));
        const result = await this.currentElement.render();
        log('ThinkingMessage rendered', { messageId: result.id });
        this.currentElement = null;
        return result;
      }

      log('Defaulting to text message');
      this.currentElement = new TextMessage(chunk);
      const result = await this.currentElement.render();
      log('TextMessage rendered', { messageId: result.id });
      return result;


    } else {
      log('Continuing with existing element', { elementType: this.currentElement.constructor.name });
 
      if (this.currentElement instanceof ToolUseMessage) {
        const endIndex = chunk.indexOf('<|tool_call_end|>') !== -1 ?
          chunk.indexOf('<|tool_call_end|>') :
          chunk.indexOf('</tool_call>');
        
        log('Processing ToolUseMessage chunk', { endIndex, chunkLength: chunk.length });

        if (endIndex !== -1) {
          log('Found tool use end tag, completing ToolUseMessage');
          this.currentElement.appendText(chunk.slice(0, endIndex));
          const rendered = await this.currentElement.render();
          this.currentElement = null;
          log('ToolUseMessage completed and reset', { messageId: rendered.id, toolCount: rendered.content.length });
          return rendered;
        }

        log('Appending to ToolUseMessage buffer');
        this.currentElement.appendText(chunk);
        return null
      }

      if (this.currentElement instanceof ThinkingMessage) {
        const idxThinking = chunk.indexOf('</thinking>');
        const idxThink = chunk.indexOf('</think>');
        log('Processing ThinkingMessage chunk', { idxThinking, idxThink });
        
        if (idxThinking !== -1 || idxThink !== -1) {
          log('Found thinking end tag, completing ThinkingMessage');
          if (idxThinking !== -1) {
            this.currentElement.appendText(chunk.slice(0, idxThinking));
          } else if (idxThink !== -1) {
            this.currentElement.appendText(chunk.slice(0, idxThink));
          }
          const rendered = await this.currentElement.render();
          this.currentElement = null;
          log('ThinkingMessage completed and reset', { messageId: rendered.id });
          return rendered;
        } else {
          log('Appending to ThinkingMessage buffer');
          this.currentElement.appendText(chunk);
          const rendered = await this.currentElement.render();
          log('ThinkingMessage updated and rendered');
          return rendered
        }
      }

      if (this.currentElement instanceof TextMessage) {
        log('Appending to TextMessage');
        this.currentElement.appendText(chunk);
        const rendered = await this.currentElement.render();
        log('TextMessage updated and rendered');
        return rendered;
      }
    }

    return null;
  }
}
