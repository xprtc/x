"use client";

import React from 'react';
import { Rnd } from 'react-rnd';
import { useOSStore, WindowState } from '@/store/osStore';
import GlassCard from './GlassCard';

interface WindowFrameProps {
  windowState: WindowState;
  children: React.ReactNode;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ windowState, children }) => {
  const { 
    focusWindow, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
    updateWindowSize
  } = useOSStore();

  const isMaximized = windowState.isMaximized;

  if (windowState.isMinimized) {
    return null;
  }

  return (
    <Rnd
      default={{
        x: windowState.position?.x || 50,
        y: windowState.position?.y || 50,
        width: windowState.size?.width || 800,
        height: windowState.size?.height || 600,
      }}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
      size={isMaximized ? { width: '100%', height: '100%' } : undefined}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="window-title-bar"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      onDragStop={(e, d) => {
        if (!isMaximized) {
          updateWindowPosition(windowState.id, { x: d.x, y: d.y });
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized) {
          updateWindowSize(windowState.id, { 
            width: ref.style.width, 
            height: ref.style.height 
          });
          updateWindowPosition(windowState.id, position);
        }
      }}
      onMouseDown={() => focusWindow(windowState.id)}
      style={{ zIndex: windowState.zIndex }}
    >
      <GlassCard className="flex flex-col w-full h-full overflow-hidden !rounded-xl border-slate-200 dark:border-slate-700 shadow-2xl">
        {/* Title Bar */}
        <div 
          className="window-title-bar h-10 flex items-center justify-between px-4 bg-slate-100/50 dark:bg-slate-800/50 border-b border-white/20 select-none cursor-default"
          onDoubleClick={() => isMaximized ? restoreWindow(windowState.id) : maximizeWindow(windowState.id)}
        >
          <div className="flex items-center gap-2">
             {windowState.icon && <span className="text-lg">{windowState.icon}</span>}
             <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{windowState.title}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); minimizeWindow(windowState.id); }}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
              aria-label="Minimize window"
              title="Minimize"
            >
              <i className="ri-subtract-line text-slate-500"></i>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); isMaximized ? restoreWindow(windowState.id) : maximizeWindow(windowState.id); }}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
              aria-label={isMaximized ? "Restore window" : "Maximize window"}
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <i className={`${isMaximized ? 'ri-file-copy-line' : 'ri-stop-line'} text-slate-500`}></i>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); closeWindow(windowState.id); }}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white transition-colors group"
              aria-label="Close window"
              title="Close"
            >
              <i className="ri-close-line text-slate-500 group-hover:text-white"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-white/40 dark:bg-slate-900/40 relative">
          <div 
             // Determine if we need an invisible overlay to prevent iframe stealing clicks during drag?? 
             // Not needed unless we use iframes, but useful to have a blocker during drag if performance issues arise.
          />
          {children}
        </div>
      </GlassCard>
    </Rnd>
  );
};

export default WindowFrame;
