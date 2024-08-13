/* eslint-disable global-require */
/* global require */
const { contextBridge, ipcRenderer } = require('electron');
const { invoke } = ipcRenderer;


// let sendMessagePort;
contextBridge.exposeInMainWorld('cosmopolis', {
  // connectPort: () => {
  //   if (sendMessagePort) return;
  //   const { port1, port2 } = new MessageChannel();
  //   sendMessagePort = port1;
  //   ipcRenderer.postMessage('connect-port', null, [port2]);
  // },
  // preferences
  getSimpleData: (keyPath) => invoke('simple-data:get', keyPath),
  setSimpleData: (keyPath, data) => invoke('simple-data:set', keyPath, data),
  // pick local file
  // pickLocalFile: () => invoke('wish:pick-local-image'),
});
