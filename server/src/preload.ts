// See the Electron documentation for details on how to use preload scripts:
import { contextBridge, ipcRenderer } from 'electron';
import { getLocalIp } from "./utils/getLocalIp";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld('electronAPI', {
  onLocalIp: (callback: (data: string[]) => void) => ipcRenderer.on('local-ip', (_event, value) => callback(value))
});

