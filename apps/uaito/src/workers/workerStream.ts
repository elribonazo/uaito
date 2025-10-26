import { WorkerEvent } from "./types";

export function streamFromWorker(worker: Worker, requestId: string, delimiter: string) {
  const encoder = new TextEncoder();
  let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;

  const onMessage = (evt: MessageEvent<WorkerEvent>) => {
    const data = evt.data;
    if (!data || data.requestId !== requestId) return;

    if (data.type === 'message') {
      const json = JSON.stringify(data.message) + delimiter;
      controllerRef?.enqueue(encoder.encode(json));
    } else if (data.type === 'done') {
      controllerRef?.close();
      worker.removeEventListener('message', onMessage);
    } else if (data.type === 'error') {
      controllerRef?.error(new Error(data.error));
      worker.removeEventListener('message', onMessage);
    }
  };

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controllerRef = controller;
      worker.addEventListener('message', onMessage);
    },
    cancel() {
      worker.removeEventListener('message', onMessage);
      controllerRef = null;
    },
  });

  return stream;
}
