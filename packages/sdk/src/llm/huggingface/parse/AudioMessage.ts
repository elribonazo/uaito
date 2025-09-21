import { BaseMessage, Message } from "@/domain/types";
import { blobToDataURL } from "@/domain/utils";
import { v4 } from "uuid";


/**
 * A class that represents an audio message.
 * @export
 * @class AudioMessage
 * @extends {BaseMessage}
 */
export class AudioMessage extends BaseMessage {
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
    '<audio>',
    '</audio>',
  ];

  /**
   * Creates an instance of AudioMessage.
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
    
    const audioUrl = this.buffer;
    
    try {
      const response = await fetch(audioUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      
      const dataurl = await blobToDataURL(blob);
      
      const message = {
        id:v4(),
        role: 'assistant' as const,
        type: 'message' as const,
        content: [
          {
            type: 'audio' as const,
            source: {
              type: 'base64' as const,
              media_type: 'audio/wav' as const,
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