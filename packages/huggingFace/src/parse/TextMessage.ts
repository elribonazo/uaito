import { BaseMessage } from "@uaito/sdk";
import { Message } from "@uaito/sdk";
import { v4 } from "uuid";


/**
 * Verbose logging utility.
 * @param {string} message - The message to log.
 * @param {*} [data] - Optional data to log.
 */
const log = (message: string, data?: any) => {
  console.log(`[TextMessage] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};



/**
 * A class that represents a text message.
 * @export
 * @class TextMessage
 * @extends {BaseMessage}
 */
export class TextMessage extends BaseMessage {
  /**
   * The unique ID of the message.
   * @public
   * @type {string}
   */
  public id: string = v4();
  /**
   * An array of strings to be replaced in the message.
   * @public
   * @type {string[]}
   */
  public replacements: string[] = [];
  /**
   * The buffer for the message.
   * @public
   * @type {string}
   */
  public buffer: string = '';

  /**
   * Creates an instance of TextMessage.
   * @param {string} [initialText=''] - The initial text of the message.
   * @param {(...messages: any[]) => void} [log=console.log] - A logging function.
   */
  constructor(initialText: string = '', private log: (...messages: any[]) => void = console.log) {
    super();
    this.buffer = this.cleanChunk(initialText);
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
      type: 'message' as const,
      chunk: true,
      content: [{ type: 'text' as const, text: this.buffer }]
    };
    
    return message;
  }
}