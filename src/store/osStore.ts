import { create } from 'zustand';

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: number | string; height: number | string };
}

interface OSStore {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
  
  openWindow: (appId: string, title: string, icon?: React.ReactNode) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number | string; height: number | string }) => void;
}

export const useOSStore = create<OSStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 100,

  openWindow: (appId, title, icon) => {
    const { windows, nextZIndex, focusWindow } = get();
    
    // Check if window for this app already exists
    const existingWindow = windows.find(w => w.appId === appId);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        set(state => ({
          windows: state.windows.map(w => 
            w.id === existingWindow.id ? { ...w, isMinimized: false } : w
          )
        }));
      }
      focusWindow(existingWindow.id);
      return;
    }

    const newWindow: WindowState = {
      id: Math.random().toString(36).substring(7),
      appId,
      title,
      icon,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
      // Default position/size, can be overridden by Window component default
      position: { x: 50 + (windows.length * 20), y: 50 + (windows.length * 20) }, 
      size: { width: 800, height: 600 }
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      nextZIndex: nextZIndex + 1
    });
  },

  closeWindow: (id) => {
    set(state => ({
      windows: state.windows.filter(w => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
    }));
  },

  minimizeWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w => 
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
    }));
  },

  maximizeWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w => 
        w.id === id ? { ...w, isMaximized: true } : w
      )
    }));
    get().focusWindow(id);
  },

  restoreWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w => 
        w.id === id ? { ...w, isMaximized: false, isMinimized: false } : w
      )
    }));
    get().focusWindow(id);
  },

  focusWindow: (id) => {
    const { windows, nextZIndex } = get();
    const target = windows.find(w => w.id === id);
    if (!target || target.zIndex === nextZIndex - 1) return; // Already on top

    set(state => ({
      windows: state.windows.map(w => 
        w.id === id ? { ...w, zIndex: state.nextZIndex } : w
      ),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1
    }));
  },

  updateWindowPosition: (id, position) => {
    set(state => ({
      windows: state.windows.map(w => 
        w.id === id ? { ...w, position } : w
      )
    }));
  },

  updateWindowSize: (id, size) => {
     set(state => ({
      windows: state.windows.map(w => 
        w.id === id ? { ...w, size } : w
      )
    }));
  }
}));
