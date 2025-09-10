import { contextBridge, ipcRenderer, shell } from "electron";
import { CustomTitlebar, TitlebarColor } from "custom-electron-titlebar";

const listeners = new Map<string, Set<(...args: any[]) => void>>();

contextBridge.exposeInMainWorld("electron", {
  dialog: async () => ipcRenderer.invoke('open-directory-dialog'),
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  receive: (channel: string, func: (...args: any[]) => void) => {
    const wrappedFunc = (_event: Electron.IpcRendererEvent, ...args: any[]) => func(...args);
    ipcRenderer.on(channel, wrappedFunc);
    return () => ipcRenderer.removeListener(channel, wrappedFunc);
  },
  openExternal: (url: string) => shell.openExternal(url),
  addUAITOListener: (eventName: string, listener: (...args: any[]) => void) => {
    console.log(`Adding listener for ${eventName}`);
    if (!listeners.has(eventName)) {
      listeners.set(eventName, new Set());
    }
    listeners.get(eventName)!.add(listener);
    ipcRenderer.on(eventName, listener);
    return listener;
  },
  removeUAITOListener: (eventName: string, listener: (...args: any[]) => void) => {
    console.log(`Removing listener for ${eventName}`);
    const eventListeners = listeners.get(eventName);
    if (eventListeners) {
      eventListeners.forEach((l) => {
        if (l.toString() === listener.toString()) {
          eventListeners.delete(l);
          ipcRenderer.removeListener(eventName, l);
        }
      });
    }
  },
  emitUAITO: (eventName: string, ...args: any[]) => {
    ipcRenderer.send(eventName, ...args);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  new CustomTitlebar({
    backgroundColor: TitlebarColor.fromHex('#6538b9'),
    menuTransparency: 0.2
  });
});