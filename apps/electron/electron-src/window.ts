import { attachTitlebarToWindow } from "custom-electron-titlebar/main";
import { BrowserWindow, shell, globalShortcut,  screen, } from "electron";
import { join } from "path";
import { isDevelop, port } from "./config";


export function createWindow(url: string): BrowserWindow {
    const primaryDisplay = screen.getPrimaryDisplay();
    let mainWindow: BrowserWindow;
  
    if (isDevelop) {
      mainWindow = new BrowserWindow({
        width: 500,
        height: 900,
        x: 0,
        y: 0,
        titleBarStyle: 'hidden',
        titleBarOverlay: true,
        show: false, // Hide the window initially
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: true,
          preload: join(__dirname, "preload.jsx"),
        },
      });
    } else {
      const { width, height } = primaryDisplay.workAreaSize;
      console.log(width, height);
      mainWindow = new BrowserWindow({
        width: width,
        height: height,
        x: 0,
        y: 0,
        titleBarStyle: 'hidden',
        titleBarOverlay: true,
        show: false, // Hide the window initially
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: true,
          preload: join(__dirname, "preload.jsx"),
        },
      });
    }
  
    attachTitlebarToWindow(mainWindow);
  
    mainWindow.loadURL(url);
  
    // Show window when ready to show
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
  
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });
  
    mainWindow.on('focus', () => {
      if (isDevelop) {
        // In development mode, allow refreshing
        globalShortcut.register('F5', () => {
          console.log('F5 is pressed');
          mainWindow.reload()
          return true;
        });
        globalShortcut.register('CommandOrControl+R', () => {
          console.log('Ctrl/Cmd+R is pressed');
          mainWindow.reload()
          return true;
        });
      } else {
        // In production mode, prevent refreshing
        globalShortcut.register('F5', () => {
          console.log('F5 is pressed (ignored in production)');
          return true;
        });
        globalShortcut.register('CommandOrControl+R', () => {
          console.log('Ctrl/Cmd+R is pressed (ignored in production)');
          return true;
        });
      }
    });
  
    mainWindow.on('blur', () => {
      globalShortcut.unregister('F5');
      globalShortcut.unregister('CommandOrControl+R');
    });
  
    mainWindow.webContents.on('will-navigate', (event, url) => {
      if (!url.startsWith('http://localhost:' + port)) {
        event.preventDefault();
        shell.openExternal(url);
      }
    });
  
    return mainWindow;
  }