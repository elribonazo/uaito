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
   this.log('ImageMessage created', { id: this.id, initialTextLength: initialText.length });
    this.buffer = this.cleanChunk(initialText);
  }


  appendText(text: string) {
   this.log('Appending text to image buffer', { textLength: text.length, currentBufferLength: this.buffer.length });
    this.buffer += text;
   this.log('Text appended to image buffer', { newBufferLength: this.buffer.length });
  }

  async render(): Promise<Message> {
   this.log('Rendering ImageMessage', { id: this.id, bufferLength: this.buffer.length });
    
    const imageUrl = this.buffer;
   this.log('Fetching image from URL', { imageUrl });
    
    try {
      const response = await fetch(imageUrl);
     this.log('Image fetch response', { 
        status: response.status, 
        statusText: response.statusText, 
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
     this.log('Image converted to array buffer', { bufferSize: arrayBuffer.byteLength });
      
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
     this.log('Created blob from array buffer', { blobSize: blob.size });
      
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
     this.log('Error rendering ImageMessage', { error, imageUrl });
      throw error;
    }
  }
}