import { v4 } from "uuid";

import { BaseMessage, type Message } from "@/types";



export class ThinkingMessage extends BaseMessage {
  public id: string = v4();
  public thinking: string = '';
  public replacements = [
    '<thinking>',
    '<think>',
    '</thinking>',
    '</think>',
  ]

  appendText(text: string) {
    this.thinking = text;
  }

  async render(): Promise<Message> {
    return {
      id: this.id,
      role: 'assistant',
      type: 'thinking',
      chunk: true,
      content: [{ type: 'thinking', thinking: this.thinking, signature: '' }]
    };
  }
}
