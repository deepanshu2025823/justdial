// app/admin/loading.tsx

import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-slate-100 border-t-[#0073c1]"></div>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
           <img 
            src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg" 
            alt="JD" 
            className="h-4 w-auto" 
          />
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm font-bold tracking-widest text-slate-800 uppercase">Synchronizing</p>
        <p className="mt-1 text-xs text-slate-400">Fetching latest data from TiDB...</p>
      </div>
    </div>
  );
}