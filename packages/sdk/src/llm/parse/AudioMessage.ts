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
  this.log('AudioMessage created', { id: this.id, initialTextLength: initialText.length });
    this.buffer = this.cleanChunk(initialText);
  }


  appendText(text: string) {
  this.log('Appending text to audio buffer', { textLength: text.length, currentBufferLength: this.buffer.length });
    this.buffer += text;
  this.log('Text appended to audio buffer', { newBufferLength: this.buffer.length });
  }

  async render(): Promise<Message> {
  this.log('Rendering AudioMessage', { id: this.id, bufferLength: this.buffer.length });
    
    const audioUrl = this.buffer;
  this.log('Fetching audio from URL', { audioUrl });
    
    try {
      const response = await fetch(audioUrl);
    this.log('Audio fetch response', { 
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
      
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    this.log('Created blob from array buffer', { blobSize: blob.size });
      
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
    this.log('Error rendering AudioMessage', { error, audioUrl });
      throw error;
    }
  }
}