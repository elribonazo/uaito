import { v4 } from "uuid";

import { BaseMessage, type Message } from "@/types";
import { blobToDataURL } from "../utils";

// Verbose logging utility
const log = (message: string, data?: any) => {
  console.log(`[AudioMessage] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};


export class AudioMessage extends BaseMessage {
  public id: string = v4();
  public buffer: string = '';
  public replacements: string[] = [
    '<audio>',
    '</audio>',
  ];

  constructor(initialText: string) {
    super();
    log('AudioMessage created', { id: this.id, initialTextLength: initialText.length });
    this.buffer = this.cleanChunk(initialText);
  }


  appendText(text: string) {
    log('Appending text to audio buffer', { textLength: text.length, currentBufferLength: this.buffer.length });
    this.buffer += text;
    log('Text appended to audio buffer', { newBufferLength: this.buffer.length });
  }

  async render(): Promise<Message> {
    log('Rendering AudioMessage', { id: this.id, bufferLength: this.buffer.length });
    
    const audioUrl = this.buffer;
    log('Fetching audio from URL', { audioUrl });
    
    try {
      const response = await fetch(audioUrl);
      log('Audio fetch response', { 
        status: response.status, 
        statusText: response.statusText, 
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      log('Image converted to array buffer', { bufferSize: arrayBuffer.byteLength });
      
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      log('Created blob from array buffer', { blobSize: blob.size });
      
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
      log('Error rendering AudioMessage', { error, audioUrl });
      throw error;
    }
  }
}