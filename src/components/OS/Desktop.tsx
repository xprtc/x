"use client";

import React from 'react';
import { useOSStore } from '@/store/osStore';
import { getAllApps } from '@/config/apps';
import WindowFrame from './WindowFrame';

const Desktop = () => {
  const { windows, openWindow } = useOSStore();
  const apps = getAllApps();

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-[url('/images/desktop-wallpaper.jpg')] bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(to bottom right, #f1f5f9, #cbd5e1)' // Fallback / Default wallpaper
      }}
    >
      {/* Desktop Icons Grid */}
      <div className="absolute top-4 left-4 flex flex-col gap-4 flex-wrap max-h-full">
        {apps.map(app => (
          <button
            key={app.id}
            onDoubleClick={() => openWindow(app.id, app.title, app.icon)}
            className="group flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/20 active:bg-white/30 transition-colors w-24 gap-2"
          >
            <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform">
               {app.icon}
            </div>
            <span className="text-xs font-semibold text-slate-700 drop-shadow-md text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-1 bg-white/30 rounded-md">
              {app.title}
            </span>
          </button>
        ))}
      </div>

      {/* Windows Layer */}
      {windows.map(window => {
         const app = apps.find(a => a.id === window.appId);
         const AppContent = app?.component || (() => <div className="p-4">App Not Found</div>);

         return (
           <WindowFrame key={window.id} windowState={window}>
              <div className="h-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900 p-4">
                 <AppContent />
              </div>
           </WindowFrame>
         );
      })}
    </div>
  );
};

export default Desktop;
