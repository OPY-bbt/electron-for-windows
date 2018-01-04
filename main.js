const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu;
const protocol = electron.protocol;
const ipcMain = electron.ipcMain;

const path = require('path')
const url = require('url')

const log = require('electron-log');
const eupdater = require('electron-updater');
const autoUpdater = eupdater.autoUpdater;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

// const ipc = electron.ipcMain;

// ipc.on('asynchronous-message', function (event, arg) {
//   event.sender.send('asynchronous-reply', 'pong')
// })

let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  })
}


let mainWindow;

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}
function createDefaultWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './frontEnd/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  return mainWindow;
}

const sendToRender = (msg) => {
  mainWindow.webContents.send('ping', msg)
};

autoUpdater.on('checking-for-update', () => {
  sendToRender('checking-for-update');
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  sendToRender('update-available');
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendToRender('update-not-available');
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
  sendToRender('error');
  sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (ev) => {
  sendToRender(ev.percent + ' ');
  sendStatusToWindow('Download progress...');
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendToRender('update-downloaded');
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
  setTimeout(function() {
    autoUpdater.quitAndInstall(); 
  }, 5000);
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

function createWindow () {

  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createDefaultWindow();

  autoUpdater.checkForUpdates();
  sendStatusToWindow('checkForUpdates');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
