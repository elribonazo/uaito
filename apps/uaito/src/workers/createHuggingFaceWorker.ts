export function createHuggingFaceWorker() {
  // @ts-ignore
  return new Worker(new URL('./hf.worker.ts', import.meta.url), { type: 'module' });
}
