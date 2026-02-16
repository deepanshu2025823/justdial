// app/admin/settings/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { 
  Settings, Globe, Shield, Bell, Save, 
  Loader2, CheckCircle, Database, Info, RefreshCw
} from "lucide-react";

export default function SettingsPage() {
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    siteName: "",
    supportEmail: "",
    maintenanceMode: false,
    aiModel: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setFormData({
          siteName: data.siteName,
          supportEmail: data.supportEmail,
          maintenanceMode: data.maintenanceMode,
          aiModel: data.aiModel
        });
      } catch (err) {
        console.error("Failed to load cloud settings");
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert("Cloud synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
      <Loader2 className="animate-spin text-[#0073c1]" size={40} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Syncing Cloud Parameters</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 font-sans">
      <div className="mb-10 px-2 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Global Settings</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <RefreshCw size={14} className="text-blue-500" /> Platform Infrastructure Management
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-black text-emerald-700 uppercase tracking-[2px]">TiDB Cloud Active</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tighter text-blue-600">
              <Globe size={22} strokeWidth={2.5} /> Identity Details
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Identity</label>
                  <input 
                    value={formData.siteName}
                    onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                    className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Mail</label>
                  <input 
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                    className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Core AI Engine</label>
                <select 
                  value={formData.aiModel}
                  onChange={(e) => setFormData({...formData, aiModel: e.target.value})}
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer focus:bg-white transition-all"
                >
                  <option value="Imagen-3-Turbo">Imagen-3-Turbo (Stable)</option>
                  <option value="DALL-E-3-Admin">DALL-E-3-Admin (High-Res)</option>
                  <option value="Stable-Diffusion-XL">Stable-Diffusion-XL (Fast)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tighter text-emerald-500">
              <Shield size={22} strokeWidth={2.5} /> Platform Access
            </h2>
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
              <div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Maintenance Shield</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Restrict public access for database updates</p>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
                className={`w-16 h-9 rounded-full transition-all flex items-center px-1.5 shadow-inner ${formData.maintenanceMode ? 'bg-red-500 justify-end' : 'bg-slate-300 justify-start'}`}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-lg transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
            <Database size={44} className="mx-auto text-[#0073c1] mb-4" strokeWidth={2.5} />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">TiDB Node State</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Status: Operational</p>
            
            <div className="mt-8 space-y-3">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter border-b border-slate-50 pb-2">
                  <span className="text-slate-400">AWS Region</span>
                  <span className="text-slate-800">ap-southeast-1</span>
               </div>
               <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Response</span>
                  <span className="text-emerald-500">Synced</span>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full mt-10 py-5 rounded-[2rem] font-black uppercase tracking-[3px] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${success ? 'bg-emerald-500 shadow-emerald-100' : 'bg-[#0073c1] hover:bg-[#005a9c] shadow-blue-100'} text-white`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : success ? <><CheckCircle size={20} /> Synced</> : <><Save size={20} /> Commit to DB</>}
            </button>
          </div>

          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-100 relative overflow-hidden group">
             <RefreshCw className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24" />
             <h3 className="text-xs font-black uppercase tracking-widest mb-2 italic">Pro Tip</h3>
             <p className="text-[11px] font-bold leading-relaxed opacity-80 uppercase tracking-tight">
               Changes to AI configurations affect the metadata generated for all business categories instantly.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}