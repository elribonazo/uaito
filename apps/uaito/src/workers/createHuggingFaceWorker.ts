export function createHuggingFaceWorker() {
  return new Worker(new URL('./hf.worker.ts', import.meta.url), { type: 'module' });
}
