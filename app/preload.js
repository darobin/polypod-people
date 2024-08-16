/* eslint-disable global-require */
/* global require */
const { contextBridge, ipcRenderer } = require('electron');
const { invoke } = ipcRenderer;


// let sendMessagePort;
contextBridge.exposeInMainWorld('polypod', {
  // connectPort: () => {
  //   if (sendMessagePort) return;
  //   const { port1, port2 } = new MessageChannel();
  //   sendMessagePort = port1;
  //   ipcRenderer.postMessage('connect-port', null, [port2]);
  // },
  // identity & login
  loadIdentities: () => invoke('identity:load'),
  login: (usr, pwd) => invoke('identity:login', usr, pwd),
  // preferences
  // getSimpleData: (keyPath) => invoke('simple-data:get', keyPath),
  // setSimpleData: (keyPath, data) => invoke('simple-data:set', keyPath, data),
  // debug
  warn: (str) => invoke('dbg:warn', str),
  // pick local file
  // pickLocalFile: () => invoke('wish:pick-local-image'),
});
