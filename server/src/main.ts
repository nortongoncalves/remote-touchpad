import { app, BrowserWindow } from 'electron';
import path from 'path';
import { websocket } from './websocket';
import { ServerData } from './entities/ServerData';
import { TouchPadEvent } from './entities/TouchPadEvent';
import { moveMouse } from './utils/moveMouse';
import { leftClickMouse } from './utils/leftClickMouse';
import { rightClickMouse } from './utils/rightClickMouse';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  return mainWindow;
}

function sendServerData({ mainWindow, serverData }: { serverData: ServerData; mainWindow: BrowserWindow }) {
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('server-data', serverData);
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  const { localIp, wss } = await websocket();
  const mainWindow = await createWindow();
  sendServerData({mainWindow, serverData: {localIp}});

  const socketIdSet = new Set();
  wss.on("connection", (socket) => {
    console.log(socket.id);
    socketIdSet.add(socket.id);
    socket.on('message', (data) => {
      console.log('Mensagem recebida do cliente:', data);
    });
    socket.on('TouchPadEvent', (data: string) => {
      const touchPadEvent = JSON.parse(data) as TouchPadEvent;
      console.log('touchPadEvent: ', touchPadEvent);
      if (String(touchPadEvent.type) === 'Move') moveMouse(touchPadEvent.moveLocationX, touchPadEvent.moveLocationY);
      if (String(touchPadEvent.type) === 'LeftClick') leftClickMouse();
      if (String(touchPadEvent.type) === 'RightClick') rightClickMouse();
    });
    socket.on('disconnect', () => {
      socketIdSet.delete(socket.id);
      console.log('Um cliente se desconectou');
    });
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
