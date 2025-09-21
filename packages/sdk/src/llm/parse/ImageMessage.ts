import { v4 } from "uuid";

import { BaseMessage, type Message } from "@/types";
import { blobToDataURL } from "../utils";


export class ImageMessage extends BaseMessage {
  public id: string = v4();
  public buffer: string = '';
  public replacements: string[] = [
    '<image>',
    '</image>',
  ];

  constructor(initialText: string, private log: (...messages: any[]) => void = console.log) {
    super();
    this.buffer = this.cleanChunk(initialText);
  }


  appendText(text: string) {
    this.buffer += text;
  }

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