"use client";

import React, { useState } from 'react';
import { useOSStore } from '@/store/osStore';
import GlassCard from './GlassCard';

const Taskbar = () => {
  const { windows, activeWindowId, focusWindow, minimizeWindow, restoreWindow } = useOSStore();
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);

  const handleWindowClick = (id: string, isMinimized: boolean, isActive: boolean) => {
    if (isActive && !isMinimized) {
      minimizeWindow(id);
    } else {
      if (isMinimized) restoreWindow(id);
      focusWindow(id);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 h-16 z-[9999]">
        <GlassCard className="h-full flex items-center px-4 justify-between !rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-white/30">
          
          <div className="flex items-center gap-4">
             {/* Start Button */}
             <button 
                onClick={() => setStartMenuOpen(!isStartMenuOpen)}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all active:scale-95"
                aria-label="Start menu"
                title="Start"
             >
                <i className="ri-apps-2-fill text-xl"></i>
             </button>

             <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-1"></div>

             {/* Dock / Running Apps */}
             <div className="flex items-center gap-2">
               {windows.map(window => (
                 <button
                   key={window.id}
                   onClick={() => handleWindowClick(window.id, window.isMinimized, activeWindowId === window.id)}
                   className={`
                      relative group flex items-center justify-center w-10 h-10 rounded-xl transition-all
                      ${window.id === activeWindowId && !window.isMinimized 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-inner' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                      }
                      ${window.isMinimized ? 'opacity-50 grayscale' : ''}
                   `}
                   title={window.title}
                 >
                   {window.icon || <i className="ri-window-line text-lg"></i>}
                   
                   {/* Active Indicator dot */}
                   {!window.isMinimized && (
                     <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500"></span>
                   )}
                 </button>
               ))}
             </div>
          </div>

          {/* System Tray */}
          <div className="flex items-center gap-4">
            <Clock />
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Network" title="Network">
               <i className="ri-wifi-line text-slate-600 dark:text-slate-400"></i>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Volume" title="Volume">
               <i className="ri-volume-up-line text-slate-600 dark:text-slate-400"></i>
            </button>
          </div>

        </GlassCard>
      </div>

      {/* Start Menu Placeholder */}
      {isStartMenuOpen && (
        <div className="fixed bottom-24 left-4 w-80 h-96 z-[9998]">
          <GlassCard className="w-full h-full flex flex-col p-4 animate-in slide-in-from-bottom-5 fade-in duration-200">
             <div className="mb-4">
                <input type="text" placeholder="Search..." className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-sm" />
             </div>
             <div className="flex-1 overflow-y-auto">
               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Applications</p>
               {/* App list will go here */}
               <div className="grid grid-cols-4 gap-2">
                 {/* Icons */}
               </div>
             </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  
  React.useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-end leading-none mr-2">
        <span className="text-xs font-bold text-slate-800 dark:text-white mb-0.5">--:--</span>
        <span className="text-[10px] text-slate-500 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end leading-none mr-2">
      <span className="text-xs font-bold text-slate-800 dark:text-white mb-0.5">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      <span className="text-[10px] text-slate-500 font-medium">
        {time.toLocaleDateString()}
      </span>
    </div>
  );
};

export default Taskbar;
