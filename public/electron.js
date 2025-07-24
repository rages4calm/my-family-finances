const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();
const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV === 'true';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      allowRunningInsecureContent: true
    },
    titleBarStyle: 'default',
    show: false
  });

  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Enable remote module for this window
  require('@electron/remote/main').enable(mainWindow.webContents);

  // Handle window close events properly
  mainWindow.on('close', (event) => {
    // Prevent default close behavior to clean up first
    event.preventDefault();
    
    // Send cleanup message to renderer process
    mainWindow.webContents.executeJavaScript(`
      if (window.databaseService && window.databaseService.close) {
        window.databaseService.close();
      }
      window.close();
    `).then(() => {
      // Now actually close the window
      mainWindow.destroy();
    }).catch(() => {
      // Force close if cleanup fails
      mainWindow.destroy();
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Transaction',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              window.postMessage({ type: 'NAVIGATE', page: 'expenses' }, '*');
            `);
          }
        },
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              window.postMessage({ type: 'NAVIGATE', page: 'dashboard' }, '*');
            `);
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Reports',
      submenu: [
        {
          label: 'View Accounts',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              window.postMessage({ type: 'NAVIGATE', page: 'accounts' }, '*');
            `);
          }
        },
        {
          label: 'View Expenses',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              window.postMessage({ type: 'NAVIGATE', page: 'expenses' }, '*');
            `);
          }
        },
        {
          label: 'Family Members',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              window.postMessage({ type: 'NAVIGATE', page: 'customers' }, '*');
            `);
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About My Family Finances',
              message: 'My Family Finances v1.0.0',
              detail: 'Created by Carl Prewitt Jr © 2025\nEmail: carl@carl-prewitt.com\n\nA comprehensive family finance management solution.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  // Always quit when all windows are closed
  app.quit();
});

app.on('before-quit', () => {
  // Force close all windows before quitting
  const windows = BrowserWindow.getAllWindows();
  windows.forEach(window => {
    if (window && !window.isDestroyed()) {
      window.destroy();
    }
  });
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});