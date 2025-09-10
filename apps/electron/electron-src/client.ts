import { EditorOptions, FetchToolsOptions, StreamOptions, UpdateToolOptions } from "./types";

export class UaitoAPI {
  constructor(
    private endpoint: string,
    private apiKey: string
  ) {

  }

  get headers() {
    return { 'token': this.apiKey }
  }

  async fetchTools(options: FetchToolsOptions) {
   try {
    const url = `${this.endpoint}/api/tools/${options.threadId}`
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
      signal: options.signal,
    });
    if (!response.ok) {
      throw new Error('Request NOT OK');
    }
    return response.json()
   } catch (err) {
    console.log(err);
    debugger;
   }
  }

  async streamMessage(options: StreamOptions) {
    const url = `${this.endpoint}/api/orquestrator/messages`
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        prompt: options.prompt,
        directory: options.directory,
        inputs: options.inputs.map((i) => typeof i.content === 'string' ? { ...i, content: [{ type: 'text', text: i }] } : i)
      }),
      signal: options.signal,
      keepalive: true
    });
    if (!response.ok) {
      throw new Error('Request NOT OK');
    }
    return {
      headers: response.headers,
      stream: response.body.getReader()
    }
  }

  async updateTool(options: UpdateToolOptions) {
    const url = `${this.endpoint}/api/tools/${options.threadId}`
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(options),
    });
    if (!response.ok) {
      throw new Error('Request NOT OK');
    }
  }

  async editorRequest(options: EditorOptions) {
    const url = `${this.endpoint}/api/editor/messages`
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        editor: options
      }),
    });
    if (!response.ok) {
      throw new Error("Couldn't request editor changes")
    }
    return response.json()
  }
}
