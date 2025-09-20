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

  constructor(initialText: string) {
    super();
    log('TextMessage created', { id: this.id, initialTextLength: initialText.length });
  }

  appendText(text: string) {
    log('Appending text', { textLength: text.length, currentBufferLength: this.buffer.length });
    this.buffer = text;
    log('Text appended', { newBufferLength: this.buffer.length });
  }

  async render(): Promise<Message> {
    log('Rendering TextMessage', { id: this.id, bufferLength: this.buffer.length });
    
    const message = {
      id: this.id,
      role: 'assistant' as const,
      type: 'message' as const,
      chunk: true,
      content: [{ type: 'text' as const, text: this.buffer }]
    };
    
    log('TextMessage rendered successfully', { 
      id: this.id, 
      contentLength: message.content[0].text.length,
      contentPreview: message.content[0].text.substring(0, 100)
    });
    
    return message;
  }
}