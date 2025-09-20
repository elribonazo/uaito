import { v4 } from "uuid";

import { BaseMessage, type Message } from "@/types";

// Verbose logging utility
const log = (message: string, data?: any) => {
  console.log(`[ThinkingMessage] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};



export class ThinkingMessage extends BaseMessage {
  public id: string = v4();
  public buffer: string = '';
  public replacements = [
    '<thinking>',
    '<think>',
    '</thinking>',
    '</think>',
  ]

  constructor(initialText: string) {
    super();

    this.buffer = this.cleanChunk(initialText);
    log('ThinkingMessage created', { id: this.id, initialTextLength: initialText.length });
    
    // Clean initial text by removing opening tags
    let cleanedText = initialText;
    for (const replacement of this.replacements) {
      if (replacement.startsWith('<') && !replacement.startsWith('</')) {
        cleanedText = cleanedText.replace(replacement, '');
      }
    }
    this.buffer = cleanedText;
    log('Initial thinking text cleaned', { cleanedLength: this.buffer.length });
  }

  appendText(text: string) {
    log('Appending text to thinking', { textLength: text.length, currentThinkingLength: this.buffer.length });
    this.buffer = text;
    log('Text appended to thinking', { newThinkingLength: this.buffer.length });
  }

  async render(): Promise<Message> {
    log('Rendering ThinkingMessage', { id: this.id, thinkingLength: this.buffer.length });
    
    const message = {
      id: this.id,
      role: 'assistant' as const,
      type: 'thinking' as const,
      chunk: true,
      content: [{ type: 'thinking' as const, thinking: this.buffer, signature: '' }]
    };
    
    log('ThinkingMessage rendered successfully', { 
      id: this.id, 
      thinkingLength: message.content[0].thinking.length,
      thinkingPreview: message.content[0].thinking.substring(0, 100)
    });
    
    return message;
  }
}
