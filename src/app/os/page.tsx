"use client";

import React, { useEffect } from 'react';
import Desktop from "@/components/OS/Desktop";
import Taskbar from "@/components/OS/Taskbar";
import { useOSStore } from '@/store/osStore';

export default function OSPage() {
  const openWindow = useOSStore(state => state.openWindow);
  
  // Auto-open CRM on page load
  useEffect(() => {
    openWindow('crm', 'CRM', <i className="ri-shake-hands-line text-2xl"></i>);
  }, [openWindow]);
  
  // Prevent default context menu to make it feel more natively OS-like (Optional)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // e.preventDefault(); 
      // Uncomment to disable right click globally, 
      // but maybe better to handle per component
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden relative font-body text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 selection:bg-blue-500/30">
       <div className="md:hidden flex flex-col items-center justify-center h-full p-8 text-center bg-white z-[10000] relative">
          <h2 className="text-2xl font-bold mb-4">Desktop OS Experience</h2>
          <p className="mb-6 text-slate-500">This interface is designed for larger screens. Please switch to a desktop or visit the Mobile Dashboard.</p>
          <a href="/dashboard/ecommerce" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium">Go to Dashboard</a>
       </div>
       <div className="hidden md:block h-full w-full">
         <Desktop />
         <Taskbar />
       </div>
    </div>
  );
}
