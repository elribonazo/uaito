import { v4 } from "uuid";

import { BaseMessage, type Message } from "@/types";

// Verbose logging utility
const log = (message: string, data?: any) => {
  console.log(`[TextMessage] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};



export class TextMessage extends BaseMessage {
  public id: string = v4();
  public replacements: string[] = [];
  public buffer: string = '';

  constructor(initialText: string = '', private log: (...messages: any[]) => void = console.log) {
    super();
    this.buffer = this.cleanChunk(initialText);
  }

  appendText(text: string) {
   this.log('Appending text', { textLength: text.length, currentBufferLength: this.buffer.length });
    this.buffer = text;
   this.log('Text appended', { newBufferLength: this.buffer.length });
  }

  async render(): Promise<Message> {
   this.log('Rendering TextMessage', { id: this.id, bufferLength: this.buffer.length });
    
    const message = {
      id: this.id,
      role: 'assistant' as const,
      type: 'message' as const,
      chunk: true,
      content: [{ type: 'text' as const, text: this.buffer }]
    };
    
   this.log('TextMessage rendered successfully', { 
      id: this.id, 
      contentLength: message.content[0].text.length,
      contentPreview: message.content[0].text.substring(0, 100)
    });
    
    return message;
  }
}