import { app, type BrowserWindow } from 'electron';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized: boolean;
}

const DEFAULT_STATE: WindowState = {
  width: 1280,
  height: 720,
  isMaximized: false,
};

let cachedStatePath: string | undefined;

function resolveStatePath(): string {
  if (cachedStatePath) {
    return cachedStatePath;
  }

  const resolvedPath = path.join(app.getPath('userData'), 'window-state.json');
  cachedStatePath = resolvedPath;
  return resolvedPath;
}

function ensureDirectoryExists(statePath: string) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
}

export function loadWindowState(): WindowState {
  const statePath = resolveStatePath();
  ensureDirectoryExists(statePath);
  try {
    const raw = fs.readFileSync(statePath, 'utf-8');
    const parsed = JSON.parse(raw) as WindowState;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

export function persistWindowState(win: BrowserWindow) {
  const saveState = () => {
    if (win.isDestroyed()) {
      return;
    }

    const statePath = resolveStatePath();
    ensureDirectoryExists(statePath);

    const bounds = win.getBounds();
    const nextState: WindowState = {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      isMaximized: win.isMaximized(),
    };

    try {
      fs.writeFileSync(statePath, JSON.stringify(nextState, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to persist window state', error);
    }
  };

  win.on('close', saveState);
  app.on('before-quit', saveState);
}
