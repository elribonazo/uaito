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
    
    // Clean initial text by removing opening tags
    let cleanedText = initialText;
    for (const replacement of this.replacements) {
      if (replacement.startsWith('<') && !replacement.startsWith('</')) {
        cleanedText = cleanedText.replace(replacement, '');
      }
    }
    this.buffer = cleanedText;
  }

  appendText(text: string) {
    this.buffer = text;
  }

  async render(): Promise<Message> {
    
    const message = {
      id: this.id,
      role: 'assistant' as const,
      type: 'thinking' as const,
      chunk: true,
      content: [{ type: 'thinking' as const, thinking: this.buffer, signature: '' }]
    };
    
    return message;
  }
}
