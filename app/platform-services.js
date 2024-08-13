
import process from 'node:process';
import { ipcMain, Menu, shell }  from 'electron';
import chalk from 'chalk';

const { handle } = ipcMain;

export function registerPlatformServiceHandlers () {
  handle('dbg:warn', handleDebugWarn);
  // handle('simple-data:get', handleSettingsGet);
  // handle('simple-data:set', handleSettingsSet);
  // handle('wish:pick-local-image', handlePickLocalImage);
  // handle('wish:generate-id', handleGenerateID);
}

// let receiveMessagePort;
// export function connectMessaging (mainWindow) {
  // ipcMain.on('connect-port', async (ev) => {
  //   receiveMessagePort = ev.ports[0];
  //   receiveMessagePort.on('message', (ev) => {
  //   });
  //   receiveMessagePort.start();
  // });
// }

export function setupMenu () {
  if (process.platform !== 'darwin') {
    console.error(chalk.bold.red(`I don't know how to set the menu on platform ${process.platform}`));
    return;
  }
  const template = [
    {
      label: 'Cosmopolis',
      submenu: [
        { role: 'about' }, // XXX this could be nicer
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    { role: 'editMenu' },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Developer',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ],
    },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => await shell.openExternal('https://berjon.com/'),
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// async function handleSettingsGet (ev, keyPath) {
//   return getSetting(keyPath);
// }
// async function handleSettingsSet (ev, keyPath, data) {
//   return setSetting(keyPath, data);
// }

// XXX we should be passing parameters here
// async function handlePickLocalImage () {
//   const { canceled, filePaths } = await dialog.showOpenDialog({
//     title: 'Pick Image',
//     buttonLabel: 'Pick',
//     properties: ['openFile', 'treatPackageAsDirectory'],
//     message: 'Pick an image.'
//   });
//   if (canceled) return;
//   if (filePaths && filePaths.length) {
//     const img = filePaths[0];
//     const type = mime.lookup(img);
//     return {
//       blob: await readFile(img),
//       type,
//     };
//   }
// }

function handleDebugWarn (ev, str) {
  console.warn(chalk.magenta(str));
}

// async function handleGenerateID () {
//   return nanoid();
// }
