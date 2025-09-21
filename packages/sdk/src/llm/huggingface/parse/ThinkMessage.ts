import { BaseMessage, Message } from "@/domain/types";
import { v4 } from "uuid";



/**
 * A class that represents a thinking message.
 * @export
 * @class ThinkingMessage
 * @extends {BaseMessage}
 */
export class ThinkingMessage extends BaseMessage {
  /**
   * The unique ID of the message.
   * @public
   * @type {string}
   */
  public id: string = v4();
  /**
   * The buffer for the message.
   * @public
   * @type {string}
   */
  public buffer: string = '';
  /**
   * An array of strings to be replaced in the message.
   * @public
   * @type {string[]}
   */
  public replacements = [
    '<thinking>',
    '<think>',
    '</thinking>',
    '</think>',
  ]

  /**
   * Creates an instance of ThinkingMessage.
   * @param {string} initialText - The initial text of the message.
   * @param {(...messages: any[]) => void} [log=console.log] - A logging function.
   */
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

  /**
   * Appends text to the message buffer.
   * @param {string} text - The text to append.
   */
  appendText(text: string) {
    this.buffer = text;
  }

  /**
   * Renders the message.
   * @returns {Promise<Message>} A promise that resolves to the rendered message.
   */
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
