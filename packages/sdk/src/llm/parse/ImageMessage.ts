import { v4 } from "uuid";

import { BaseMessage, type Message } from "@/types";

// Verbose logging utility
const log = (message: string, data?: any) => {
  console.log(`[ImageMessage] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};


export class ImageMessage extends BaseMessage {
  public id: string = v4();
  public buffer: string = '';
  public replacements: string[] = [
    '<image>',
    '</image>',
  ];

  constructor(initialText: string) {
    super();
    log('ImageMessage created', { id: this.id, initialTextLength: initialText.length });
    this.buffer = this.cleanChunk(initialText);
  }

  private blobToDataURL(blob: Blob): Promise<string> {
    log('Converting blob to data URL', { blobSize: blob.size, blobType: blob.type });
    
    return new Promise<string>((resolve, reject) => {
      try {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const result = e.target?.result as string;
          log('Blob converted to data URL successfully', { dataUrlLength: result?.length });
          resolve(result);
        }
        fileReader.onerror = (e) => {
          log('Error converting blob to data URL', { error: e });
          reject(e);
        }
        fileReader.readAsDataURL(blob);
      } catch (e) {
        log('Exception in blob conversion', { error: e });
        reject(e);
      }
    });
  }

  appendText(text: string) {
    log('Appending text to image buffer', { textLength: text.length, currentBufferLength: this.buffer.length });
    this.buffer += text;
    log('Text appended to image buffer', { newBufferLength: this.buffer.length });
  }

  async render(): Promise<Message> {
    log('Rendering ImageMessage', { id: this.id, bufferLength: this.buffer.length });
    
    const imageUrl = this.buffer;
    log('Fetching image from URL', { imageUrl });
    
    try {
      const response = await fetch(imageUrl);
      log('Image fetch response', { 
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
      
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
      log('Created blob from array buffer', { blobSize: blob.size });
      
      const dataurl = await this.blobToDataURL(blob);
      
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
      log('Error rendering ImageMessage', { error, imageUrl });
      throw error;
    }
  }
}