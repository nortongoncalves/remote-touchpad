import { app, BrowserWindow, Tray, Menu } from 'electron';
import path from 'path';
import { Server } from './server';

type CreateTrayParams = {
  win: BrowserWindow;
};

function closeApp(win: BrowserWindow) {
  win.close();
}

function openApp(win: BrowserWindow) {
  win.show();
  win.focus();
}

function createTray({ win }: CreateTrayParams) {
  const pathTrayIcon = path.join(__dirname, 'assets/tray-icon.png');
  const tray = new Tray(pathTrayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir', type: 'normal', click: () => openApp(win) },
    { label: 'Fechar', type: 'normal', click: () => closeApp(win) },
  ]);
  tray.setContextMenu(contextMenu);
  return { tray };
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  return { win };
}

const { server } = Server();

app.whenReady().then(() => {
  const { win } = createWindow();
  createTray({ win });

  app.on('browser-window-blur', () => {
    win.hide();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  server.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
