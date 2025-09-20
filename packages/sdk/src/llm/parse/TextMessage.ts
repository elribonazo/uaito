import { v4 } from "uuid";

import { BaseMessage, type Message } from "@/types";



export class TextMessage extends BaseMessage {
  public id: string = v4();
  public replacements: string[] = [];

  appendText(text: string) {
    this.buffer = text;
  }

  async render(): Promise<Message> {
    return {
      id: this.id,
      role: 'assistant',
      type: 'message',
      chunk: true,
      content: [{ type: 'text', text: this.buffer }]
    };
  }
}