/* eslint-disable global-require */
/* global require, process */
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
  // configuration
  domain: (process.env.NODE_ENV === 'production') ? 'matrix.polypod.space' : 'matrix.polypod.bast',
  // identity & login
  getCredentials: () => invoke('identity:get-credentials'),
  setCredentials: (usr, pwd) => invoke('identity:set-credentials', usr, pwd),
  // login: (usr, pwd) => invoke('identity:login', usr, pwd),
  // preferences
  // getSimpleData: (keyPath) => invoke('simple-data:get', keyPath),
  // setSimpleData: (keyPath, data) => invoke('simple-data:set', keyPath, data),
  // debug
  warn: (str) => invoke('dbg:warn', str),
  // pick local file
  // pickLocalFile: () => invoke('wish:pick-local-image'),
});
