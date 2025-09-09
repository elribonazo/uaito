import {
  InterruptableStoppingCriteria,
  PreTrainedTokenizer
} from "@huggingface/transformers";


import { Message } from "../../types";
import { END_HEADER_TAG, END_TAG, START_HEADER_TAG, START_TEXT_TAG } from "./llama/constants";






export class StopCriteria extends InterruptableStoppingCriteria {
  private reason: Message | null = null;


  constructor(
    private tokenizer: PreTrainedTokenizer,
  ) {
    super();
  }

  public setReason(reason: Message | null) {
    this.reason = reason
  }

  public getReason() {
    return this.reason
  }

  private parse(json: string): any {
    try {
      return JSON.parse(json);
    } catch (error) {
      return json;
    }
  }

  private clean(text: string): string {
    return text.replace(END_TAG, "")
      .replace(START_TEXT_TAG, "")
      .replace(START_HEADER_TAG, "")
      .replace(END_HEADER_TAG, "")
      .replace(END_TAG, "")
  }

  public override _call(sections: number[][], scores: any): any[] {
    return sections.map((s, i) => {
      const currentDecoded = this.tokenizer.decode(s);
      console.log(currentDecoded)
        let active: boolean = false;
        const parsedMessage = s.reduce<string[]>((text, i) => {
          const decodedI = this.tokenizer.decode([i]);
          // if (decodedI.includes(START_TOOL_TAG)) {
          //   active = true;
          //   return [];
          // } else if (decodedI.includes(END_TOOL_TAG)) {
          //   active = false
          //   return [];
          // }
          // if (active) {
          //   return [...text, this.clean(decodedI)];
          // }
          return text;
        }, [])
        if (parsedMessage.length > 0) {
          const body = this.parse(parsedMessage.join(""));
          if (typeof body !== 'string') {
            const id = `tool-${i}`;
            const message: Message = {
              id,
              role: 'assistant',
              type: 'tool_use',
              content: [{
                ...body,
                id,
                input: body.parameters ?? {},
                type: 'tool_use'
              }]
            }
            if (!currentDecoded.includes(`Output for tool${id}`)) {
              this.setReason(message);
              return true;
            } 
          }
    
      }
      return false;
    })
  }
}

