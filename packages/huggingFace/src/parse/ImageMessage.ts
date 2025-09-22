import { v4 } from "uuid";

import { BaseMessage, Message } from "@uaito/sdk";
import { blobToDataURL } from "@uaito/sdk";


/**
 * A class that represents an image message.
 * @export
 * @class ImageMessage
 * @extends {BaseMessage}
 */
export class ImageMessage extends BaseMessage {
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
  public replacements: string[] = [
    '<image>',
    '</image>',
  ];

  /**
   * Creates an instance of ImageMessage.
   * @param {string} initialText - The initial text of the message.
   * @param {(...messages: any[]) => void} [log=console.log] - A logging function.
   */
  constructor(initialText: string, private log: (...messages: any[]) => void = console.log) {
    super();
    this.buffer = this.cleanChunk(initialText);
  }


  /**
   * Appends text to the message buffer.
   * @param {string} text - The text to append.
   */
  appendText(text: string) {
    this.buffer += text;
  }

  /**
   * Renders the message.
   * @returns {Promise<Message>} A promise that resolves to the rendered message.
   */
  async render(): Promise<Message> {
    
    const imageUrl = this.buffer;
    
    try {
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
      
      const dataurl = await blobToDataURL(blob);
      
      const message = {
        id:v4(),
        role: 'assistant' as const,
        type: 'message' as const,
        content: [
          {
            type: 'image' as const,
            source: {
              type: 'base64' as const,
              media_type: 'image/png' as const,
              data: dataurl
            }
          }
        ]
      };
      
      return message;
      
    } catch (error) {
      throw error;
    }
  }
}