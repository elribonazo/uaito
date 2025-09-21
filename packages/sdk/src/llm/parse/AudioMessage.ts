import { v4 } from "uuid";

import { BaseMessage, type Message } from "@/types";
import { blobToDataURL } from "../utils";


export class AudioMessage extends BaseMessage {
  public id: string = v4();
  public buffer: string = '';
  public replacements: string[] = [
    '<audio>',
    '</audio>',
  ];

  constructor(initialText: string, private log: (...messages: any[]) => void = console.log) {
    super();
    this.buffer = this.cleanChunk(initialText);
  }


  appendText(text: string) {
    this.buffer += text;
  }

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