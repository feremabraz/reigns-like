import { app, BrowserWindow } from 'electron';
import * as path from 'node:path';
import { loadWindowState, persistWindowState } from './window-state';

const WINDOW_DEFAULTS = {
  width: 1280,
  height: 720,
  minWidth: 960,
  minHeight: 600,
};

async function createWindow() {
  const savedState = loadWindowState();
  const window = new BrowserWindow({
    width: savedState.width ?? WINDOW_DEFAULTS.width,
    height: savedState.height ?? WINDOW_DEFAULTS.height,
    x: savedState.x,
    y: savedState.y,
    minWidth: WINDOW_DEFAULTS.minWidth,
    minHeight: WINDOW_DEFAULTS.minHeight,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (savedState.isMaximized) {
    window.maximize();
  }

  persistWindowState(window);

  const devServerUrl = process.env.VITE_DEV_SERVER_URL ?? 'http://127.0.0.1:5173';

  if (!app.isPackaged) {
    try {
      await window.loadURL(devServerUrl);
      window.webContents.openDevTools({ mode: 'detach' });
    } catch (error) {
      console.warn('Dev server not reachable, falling back to bundled files.', error);
      const indexHtml = path.join(__dirname, '../renderer/index.html');
      await window.loadFile(indexHtml);
    }
  } else {
    const indexHtml = path.join(__dirname, '../renderer/index.html');
    await window.loadFile(indexHtml);
  }

  window.on('blur', () => {
    window.webContents.send('browser-blur');
  });

  window.on('focus', () => {
    window.webContents.send('browser-focus');
  });
}

app.whenReady().then(() => {
  void createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
