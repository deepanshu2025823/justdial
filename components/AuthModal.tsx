// components/AuthModal.tsx

"use client";
import React, { useState } from "react";
import { X, Phone, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-full transition text-slate-400">
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Welcome to Justdial</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Login or Create a new account in seconds</p>
          </div>

          <div className="space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setMethod("phone")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${method === "phone" ? "bg-white text-[#0073c1] shadow-sm" : "text-slate-500"}`}
              >
                Phone Number
              </button>
              <button 
                onClick={() => setMethod("email")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${method === "email" ? "bg-white text-[#0073c1] shadow-sm" : "text-slate-500"}`}
              >
                Email Address
              </button>
            </div>

            <div className="space-y-4">
              {method === "phone" ? (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
                  <input 
                    type="tel" 
                    placeholder="Enter Mobile Number" 
                    className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0073c1] focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                  />
                </div>
              ) : (
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    placeholder="Enter Email Address" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0073c1] focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                  />
                </div>
              )}

              <button 
                className="w-full bg-[#0073c1] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 transition active:scale-95 flex items-center justify-center gap-2"
                onClick={() => { setLoading(true); }}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Get OTP <ArrowRight size={16} /></>}
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-medium px-6">
              By continuing, you agree to Justdial's <span className="text-[#0073c1] cursor-pointer underline">Terms of Use</span> and <span className="text-[#0073c1] cursor-pointer underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}