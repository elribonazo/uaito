import { join } from "path";
import { v4 } from 'uuid';
import {
  BrowserWindow,
  app,
  ipcMain,
  dialog,
  Menu,
} from "electron";
import {
  setupTitlebar,
} from "custom-electron-titlebar/main";
import {
  existsSync,
  mkdirSync
} from 'fs';
import { updateElectronApp, UpdateSourceType } from 'update-electron-app';
import { LLMProvider } from '@uaito/sdk'
import { UaitoAPI } from "./client";
import { menu } from "./menu";
import { createServer } from "./server";
import { createWindow } from "./window";
import { processTools } from "./process";


const aborts = new Map<string, AbortController>();

if (!existsSync(join(app.getPath('userData'), ".workspace"))) {
  mkdirSync(join(app.getPath('userData'), ".workspace"))
}


Menu.setApplicationMenu(menu);
const port: number = parseInt(process.env.PORT || '3000', 10);


(async () => {

  try {
    await app.whenReady();
    setupTitlebar();
    const server = await createServer();

    await new Promise<void>((resolve) => server.listen(port, resolve));
    console.log(`> Ready on http://localhost:${port}`);

    const url = `http://localhost:${port}/`;
    const mainWindow = createWindow(url);

    updateElectronApp({
      updateSource: {
        host: 'https://update.electronjs.org',
        type: UpdateSourceType.ElectronPublicUpdateService,
        repo: 'uaito/releases'
      },
      updateInterval: '5 minutes'
    });

    app.on("window-all-closed", app.quit);

    ipcMain.handle('open-directory-dialog', async () => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
      });
      return result;
    });



    ipcMain.on('stream-abort', async (event, data: any) => {
      const { chatId } = data;
      const controller = aborts.get(chatId);
      if (controller) {
        controller.abort()
      }
    });

    ipcMain.on('stream', async (event, data: any) => {
      const {
        ENDPOINT,
        apiKey,
        chatId,
        directory,
        inputs,
        prompt,
      } = data;
      const controller = new AbortController();
      aborts.set(chatId, controller)
      const client = new UaitoAPI(
        ENDPOINT,
        apiKey
      )
      console.log("onStream message")
      event.sender.send('UAITO-MESSAGE', {
        chatId,
        message: JSON.stringify({
          role: 'user',
          type: 'message',
          id: v4(),
          content: [
            {
              type: 'text',
              text: prompt
            }
          ]
        }),
      })
      console.log("onStream message end")

      event.sender.send('UAITO-STREAM-STATE', {
        chatId,
        state: 'streaming'
      })
      try {
        const { stream, headers } = await client.streamMessage({
          chatId,
          prompt,
          inputs,
          directory,
          signal: controller.signal,
          provider: LLMProvider.Anthropic
        })
        const threadId = headers.get("X-Thread-Id");
        event.sender.send('UAITO-THREAD', {
          chatId,
          threadId
        })
        processTools(client, chatId, threadId, directory, controller.signal)
        while (true) {
          const { done, value } = await stream.read();
          if (done) break;
          const json = Buffer.from(value).toString('utf-8')
          const messages = json.split("<-[*0M0*]->")
          messages.filter((m) => m !== "").forEach((m) => {
            const msg = {
              chatId,
              message: m
            };
            console.log("Streaming", msg)
            event.sender.send('UAITO-MESSAGE', msg)
          })
        }
      } catch (err) {
        console.log("stream err", err)
      } finally {
        aborts.delete(chatId)
        event.sender.send('UAITO-STREAM-STATE', {
          chatId,
          state: 'ready'
        })
        controller.abort()
      }
    })
    // Handle content-loaded message from renderer
    ipcMain.on('content-loaded', (event) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      if (window && !window.isVisible()) {
        window.show();
      }
    });
  } catch (err) {
    console.error('An error occurred while starting the app:', err);
    process.exit(1);
  }

})();



