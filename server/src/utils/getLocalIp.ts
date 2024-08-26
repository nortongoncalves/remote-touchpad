import os from 'os';

export async function getLocalIp() {
  const networkInterfaces = os.networkInterfaces();
  const networkAddressSet = new Set<string>();
  for (const key in networkInterfaces) {
    const networkList = networkInterfaces[key];
    networkList.forEach(network => {
      if (!network.internal && network.family === 'IPv4') networkAddressSet.add(network.address);
    })
  }
  return [...networkAddressSet]
}

