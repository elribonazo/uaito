import { app, Menu, MenuItemConstructorOptions } from "electron";
import { isDevelop } from "./config";
const template: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Exit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => { app.quit() }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' }
        ]
    },
    {
        label: 'Configuration',
        submenu: [
            {
                label: 'View',
                click: (_, focusedWindow) => {
                    if (focusedWindow) focusedWindow.webContents.send('location-change', '/config');
                }
            },
        ]
    },
    {
        label: 'Chats',
        submenu: [
            {
                label: 'My chats',
                click: (_, focusedWindow) => {
                    if (focusedWindow) focusedWindow.webContents.send('location-change', '/chat');
                }
            },
        ]
    }
];
const viewSubMenu = []
if (isDevelop) {
    viewSubMenu.push({
        label: 'Toggle Developer Tools',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: (_, focusedWindow) => {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        }
    })
}
if (viewSubMenu.length > 0) {
    template.push({
        label: 'View',
        submenu: viewSubMenu
    })
}
export const menu = Menu.buildFromTemplate(template);