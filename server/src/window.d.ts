interface Window {
  electronAPI: {
    onServerData: (callback: unknown) => void;
    setServerData: (value: unknown) => void;
  };
}
