import type { BaseMessage, Tool } from "@/types";
import { ThinkingMessage } from "./parse/ThinkMessage";
import { ToolUseMessage } from "./parse/ToolUseMessage";
import { ImageMessage } from "./parse/ImageMessage";
import { TextMessage } from "./parse/TextMessage";



export class MessageCache {
  public currentElement: BaseMessage | null = null;

  constructor(public tools: Tool[]) { }

  async processChunk(chunk: string) {
    if (!this.currentElement) {
      //We need to know which type of element it is we are processing
      //thinking, tool_use, etc

      const idxThinking = chunk.indexOf('<thinking>');
      const idxThink = chunk.indexOf('<think>');
      const hasThinkingOpenTags = idxThinking !== -1 || idxThink !== -1;

      if (hasThinkingOpenTags) {
        this.currentElement = new ThinkingMessage(chunk);
        return this.currentElement.render();
      }

      const toolUseOpenTagIndex = chunk.indexOf('<|tool_call_start|>') !== -1 ?
        chunk.indexOf('<|tool_call_start|>') :
        chunk.indexOf('<tool_call>');

      if (toolUseOpenTagIndex !== -1) {
        this.currentElement = new ToolUseMessage(chunk, this.tools);
        return null
      }

      const imageOpenTagIndex = chunk.indexOf('<image>');
      if (imageOpenTagIndex !== -1) {
        this.currentElement = new ImageMessage(chunk.replace('<image>', ''));
        return null
      }

      this.currentElement = new TextMessage(chunk);
      return this.currentElement.render();


    } else {
      if (this.currentElement instanceof TextMessage) {
        this.currentElement.appendText(chunk);
        const rendered = await this.currentElement.render();
        return rendered;
      }
      if (this.currentElement instanceof ImageMessage) {
        const endIndex = chunk.indexOf('</image>');
        if (endIndex !== -1) {
          this.currentElement.appendText(chunk.slice(0, endIndex));
          const rendered = this.currentElement.render();
          this.currentElement = null;
          return rendered;
        }
        this.currentElement.appendText(chunk);
        return null
      }
      if (this.currentElement instanceof ToolUseMessage) {
        const endIndex = chunk.indexOf('<|tool_call_end|>') !== -1 ?
          chunk.indexOf('<|tool_call_end|>') :
          chunk.indexOf('</tool_call>');

        if (endIndex !== -1) {
          this.currentElement.appendText(chunk.slice(0, endIndex));
          const rendered = this.currentElement.render();
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
          const rendered = this.currentElement.render();
          this.currentElement = null;
          return rendered;
        } else {
          this.currentElement.appendText(chunk);
          const rendered = this.currentElement.render();
          return rendered
        }
      }
    }

    return null;
  }
}
