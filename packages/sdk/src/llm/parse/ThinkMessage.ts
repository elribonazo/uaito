import { v4 } from "uuid";

import { BaseMessage, type Message } from "@/types";


export class ThinkingMessage extends BaseMessage {
  public id: string = v4();
  public buffer: string = '';
  public replacements = [
    '<thinking>',
    '<think>',
    '</thinking>',
    '</think>',
  ]

  constructor(initialText: string, private log: (...messages: any[]) => void = console.log) {
    super();

    this.buffer = this.cleanChunk(initialText);
   this.log('ThinkingMessage created', { id: this.id, initialTextLength: initialText.length });
    
    // Clean initial text by removing opening tags
    let cleanedText = initialText;
    for (const replacement of this.replacements) {
      if (replacement.startsWith('<') && !replacement.startsWith('</')) {
        cleanedText = cleanedText.replace(replacement, '');
      }
    }
    this.buffer = cleanedText;
   this.log('Initial thinking text cleaned', { cleanedLength: this.buffer.length });
  }

  appendText(text: string) {
   this.log('Appending text to thinking', { textLength: text.length, currentThinkingLength: this.buffer.length });
    this.buffer = text;
   this.log('Text appended to thinking', { newThinkingLength: this.buffer.length });
  }

  async render(): Promise<Message> {
   this.log('Rendering ThinkingMessage', { id: this.id, thinkingLength: this.buffer.length });
    
    const message = {
      id: this.id,
      role: 'assistant' as const,
      type: 'thinking' as const,
      chunk: true,
      content: [{ type: 'thinking' as const, thinking: this.buffer, signature: '' }]
    };
    
   this.log('ThinkingMessage rendered successfully', { 
      id: this.id, 
      thinkingLength: message.content[0].thinking.length,
      thinkingPreview: message.content[0].thinking.substring(0, 100)
    });
    
    return message;
  }
}
