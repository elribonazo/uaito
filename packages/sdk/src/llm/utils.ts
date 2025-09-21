import type { BaseMessage, Tool } from "@/types";
import { ThinkingMessage } from "./parse/ThinkMessage";
import { ToolUseMessage } from "./parse/ToolUseMessage";
import { ImageMessage } from "./parse/ImageMessage";
import { TextMessage } from "./parse/TextMessage";
import { AudioMessage } from "./parse/AudioMessage";

export const blobToDataURL = async (blob: Blob): Promise<string> => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const dataUrl = `data:${blob.type};base64,${buffer.toString("base64")}`;
  return dataUrl;
};


export class MessageCache {
  public currentElement: BaseMessage | null = null;

  constructor(public tools: Tool[], private log: (...messages: any[]) => void = console.log) { }

  async processChunk(chunk: string) {
    
    if (!this.currentElement) {
      //We need to know which type of element it is we are processing
      //thinking, tool_use, etc

      const idxThinking = chunk.indexOf('<thinking>');
      const idxThink = chunk.indexOf('<think>');
      const hasThinkingOpenTags = idxThinking !== -1 || idxThink !== -1;
      if (hasThinkingOpenTags) {
        this.currentElement = new ThinkingMessage(chunk, this.log);
        const result = await this.currentElement.render();
        return result;
      }

      const toolUseOpenTagIndex = chunk.indexOf('<|tool_call_start|>') !== -1 ?
        chunk.indexOf('<|tool_call_start|>') :
        chunk.indexOf('<tool_call>');

      if (toolUseOpenTagIndex !== -1) {
        this.currentElement = new ToolUseMessage(chunk, this.tools, this.log);
        return null
      }

      const audioOpenTagIndex = chunk.indexOf('<audio>');
      if (audioOpenTagIndex !== -1) {
        this.currentElement = new AudioMessage(chunk.replace('<audio>', ''), this.log);
        const result = await this.currentElement.render();
        this.currentElement = null;
        return result;
      }

      const imageOpenTagIndex = chunk.indexOf('<image>');
      if (imageOpenTagIndex !== -1) {
        this.currentElement = new ImageMessage(chunk.replace('<image>', ''), this.log);
        const result = await this.currentElement.render();
        this.currentElement = null;
        return result;
      }

      this.currentElement = new TextMessage(chunk, this.log);
      const result = await this.currentElement.render();
      return result;


    } else {
 
      if (this.currentElement instanceof ToolUseMessage) {
        const endIndex = chunk.indexOf('<|tool_call_end|>') !== -1 ?
          chunk.indexOf('<|tool_call_end|>') :
          chunk.indexOf('</tool_call>');
        
        if (endIndex !== -1) {
          this.currentElement.appendText(chunk.slice(0, endIndex));
          const rendered = await this.currentElement.render();
          this.currentElement = null;
          return rendered;
        }

        this.currentElement.appendText(chunk);
        return null
      }

      if (this.currentElement instanceof ThinkingMessage) {
        const idxThinking = chunk.indexOf('</thinking>');
        const idxThink = chunk.indexOf('</think>');
        
        if (idxThinking !== -1 || idxThink !== -1) {
          if (idxThinking !== -1) {
            this.currentElement.appendText(chunk.slice(0, idxThinking));
          } else if (idxThink !== -1) {
            this.currentElement.appendText(chunk.slice(0, idxThink));
          }
          const rendered = await this.currentElement.render();
          this.currentElement = null;
          return rendered;
        } else {
          this.currentElement.appendText(chunk);
          const rendered = await this.currentElement.render();
          return rendered
        }
      }

      if (this.currentElement instanceof TextMessage) {
        this.currentElement.appendText(chunk);
        const rendered = await this.currentElement.render();
        return rendered;
      }
    }

    return null;
  }
}
