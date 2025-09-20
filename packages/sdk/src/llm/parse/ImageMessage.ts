import { v4 } from "uuid";

import { BaseMessage, type Message } from "@/types";


export class ImageMessage extends BaseMessage {
  public id: string = v4();
  public replacements: string[] = [];
  private blobToDataURL(blob) {
    return new Promise<string>((resolve, reject) => {
      try {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          resolve(e.target?.result as any);
        }
        fileReader.readAsDataURL(blob);
      } catch (e) {
        reject(e);
      }
    });
  }

  appendText(text: string) {
    this.buffer += text;
  }

  async render(): Promise<Message> {
    const imageUrl = this.buffer;
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    const dataurl = await this.blobToDataURL(blob);
    return {
      id: this.id,
      role: 'assistant',
      type: 'message',
      chunk: true,
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: dataurl
          }
        }
      ]
    };
  }
}