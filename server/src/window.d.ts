interface Window {
  electronAPI: {
    onLocalIp: (callback: (data: string[]) => void) => void;
  };
}
