
import { app, BrowserWindow }  from 'electron';
import { manageWindowPosition } from './lib/window-manager.js';
import { initProfileDir, loadIdentities } from './lib/app-storage.js';
import isProd from '../shared/is-prod.js';
import makeRel from '../shared/rel.js';
// import tileProtocolHandler from './tile-protocol-handler.js';
import { registerPlatformServiceHandlers, setupMenu } from './platform-services.js';

// Docs
// - profile: so the app can support multiple profiles
// - identities {}
//    - profile: the full Bluesky profile as returned by the API
//    - blueskyAccount: the handle that we're using for Bluesky
// - keyPair: { privateKey, publicKey }
export const ctx = {
  profile: isProd ? '_default' : '_default-dev',
};
let mainWindow;
const rel = makeRel(import.meta.url);

// there can be only one
const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
  app.quit();
}
else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(async () => {
  // protocol.registerStreamProtocol('tile', tileProtocolHandler);
  registerPlatformServiceHandlers();
  await initProfileDir();
  await loadIdentities();
  mainWindow = new BrowserWindow({
    show: false,
    backgroundColor: '#fff',
    title: 'polypod',
    titleBarStyle: 'hiddenInset',
    icon: './img/icon.png',
    webPreferences: {
      webviewTag: false,
      preload: rel('./preload.js'),
    },
  });
  await manageWindowPosition(mainWindow);
  setupMenu();
  mainWindow.loadFile('index.html');
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.openDevTools(); // remove this in builds
  });
  const { webContents } = mainWindow;

  // reloading
  webContents.on('before-input-event', makeKeyDownMatcher('cmd+R', reload));
  webContents.on('before-input-event', makeKeyDownMatcher('ctrl+R', reload));
  webContents.on('before-input-event', makeKeyDownMatcher('cmd+alt+I', openDevTools));
  webContents.on('before-input-event', makeKeyDownMatcher('ctrl+alt+I', openDevTools));
});

// app.on('will-quit', shutdown);

function reload () {
  console.log('RELOAD');
  mainWindow.reload();
}

function openDevTools () {
  mainWindow.webContents.openDevTools();
}

function makeKeyDownMatcher (sc, cb) {
  return makeKeyMatcher('keyDown', sc, cb);
}

function makeKeyMatcher (type, sc, cb) {
  let parts = sc.split(/[+-]/)
    , key = parts.pop().toLowerCase()
    , modifiers = {
        shift: false,
        control: false,
        meta: false,
        alt: false,
      }
  ;
  parts.forEach(p => {
    p = p.toLowerCase();
    if (p === 'ctrl') p = 'control';
    if (p === 'cmd') p = 'meta';
    if (typeof modifiers[p] !== 'boolean') console.warn(`Unknown command modifier ${p}.`);
    modifiers[p] = true;
  });
  return (evt, input) => {
    if (type !== input.type) return;
    if (key !== input.key) return;
    let badMod = false;
    Object.keys(modifiers).forEach(mod => {
      if (input[mod] !== modifiers[mod]) badMod = true;
    });
    if (badMod) return;
    cb();
  };
}
