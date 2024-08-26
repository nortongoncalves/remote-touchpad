// See the Electron documentation for details on how to use preload scripts:
import { contextBridge, ipcRenderer } from 'electron';
import { ServerData } from './entities/ServerData';

export type CallBackServerData = (value: ServerData) => void;

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld('electronAPI', {
  onServerData: (callback: CallBackServerData) => ipcRenderer.on('server-data', (_event, value) => callback(value)),
});

