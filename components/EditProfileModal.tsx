// components/EditProfileModal.tsx

"use client";
import React, { useState } from "react";
import { X, User, Phone, Save, Loader2 } from "lucide-react";

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }: any) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        body: JSON.stringify({ id: user.id, name, phone }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem("jd_user", JSON.stringify(updatedUser));
        onUpdate(updatedUser);
        onClose();
      }
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Account Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                required value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#0073c1] text-white py-5 rounded-[2rem] font-black uppercase tracking-[3px] text-xs shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Identity</>}
          </button>
        </form>
      </div>
    </div>
  );
}