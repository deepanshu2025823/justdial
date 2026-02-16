// app/admin/sidebar.tsx

"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Store, Users, MessageSquare, 
  Settings, LogOut, Menu, Search, Bell, Layers, 
  ChevronDown, User, Shield, CheckCircle, AlertCircle, Clock,
  Activity, Globe
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
        setIsNotifyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[9999] overflow-hidden bg-blue-100">
          <div className="h-full bg-[#0073c1] animate-progress-fast shadow-[0_0_10px_#0073c1]"></div>
        </div>
      )}

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0f172a] text-white transition-transform duration-300 ease-in-out flex flex-col shadow-2xl border-r border-slate-800
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-[#0f172a] shrink-0">
          <img 
            src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg" 
            alt="Justdial Admin" 
            className="h-7 w-auto brightness-0 invert opacity-90" 
          />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar pt-6">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4">Main Menu</p>
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" setIsNavigating={setIsNavigating} />
          <NavItem href="/admin/categories" icon={<Layers size={20} />} label="Categories" setIsNavigating={setIsNavigating} />
          <NavItem href="/admin/listings" icon={<Store size={20} />} label="Business Listings" setIsNavigating={setIsNavigating} />
          <NavItem href="/admin/users" icon={<Users size={20} />} label="User Management" setIsNavigating={setIsNavigating} />
          <NavItem href="/admin/leads" icon={<MessageSquare size={20} />} label="Leads & Enquiries" setIsNavigating={setIsNavigating} />
          
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4 mt-8">Administration</p>
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" setIsNavigating={setIsNavigating} />
        </nav>

        <div className="p-4 border-t border-slate-800 bg-[#0b1120] shrink-0">
          <div className="flex items-center gap-3 px-2 py-1 bg-white/5 rounded-xl border border-white/5">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight leading-none">Database Online</p>
              <p className="text-[9px] text-slate-500 mt-1 font-medium tracking-wide">Region: ap-southeast-1</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-4 md:px-8 shadow-sm z-30 relative shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center gap-3 bg-slate-100 px-4 py-2.5 rounded-2xl w-64 lg:w-96 border border-transparent focus-within:border-blue-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all group">
              <Search size={18} className="text-slate-400 group-focus-within:text-[#0073c1]" />
              <input 
                type="text" 
                placeholder="Search listings, users..." 
                className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-5">
            <div className="relative" ref={notifyRef}>
              <button 
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                className={`relative p-2.5 rounded-full transition-all active:scale-90 ${isNotifyOpen ? 'bg-blue-50 text-[#0073c1]' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
              </button>

              {isNotifyOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in duration-200 origin-top-right">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                    <span className="px-2 py-0.5 bg-blue-100 text-[#0073c1] text-[10px] font-bold rounded-full">4 NEW</span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    <NotificationRow icon={<User />} title="New Admin Registration" time="Just now" color="bg-blue-100 text-blue-600" />
                    <NotificationRow icon={<Activity />} title="System Performance Optimal" time="15m ago" color="bg-green-100 text-green-600" />
                    <NotificationRow icon={<MessageSquare />} title="New Business Enquiry" time="2h ago" color="bg-purple-100 text-purple-600" />
                    <NotificationRow icon={<AlertCircle />} title="Database Backup Success" time="5h ago" color="bg-amber-100 text-amber-600" />
                  </div>
                  <button className="w-full p-3 text-xs text-slate-500 hover:text-[#0073c1] font-bold border-t border-slate-50 transition-colors">
                    View All Activity
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 p-1.5 pr-3 rounded-full border transition-all active:scale-95 ${isProfileOpen ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-50' : 'border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0073c1] to-blue-400 flex items-center justify-center text-white font-bold shadow-inner">
                  A
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">Super Admin</p>
                  <p className="text-[10px] text-slate-400 font-medium">Deepanshu Joshi</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in slide-in-from-top-2 origin-top-right">
                  <div className="px-5 py-4 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-800">Administrator</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">mr.deepanshujoshi@gmail.com</p>
                  </div>
                  
                  <div className="py-2 px-2">
                    <ProfileLink href="/admin/profile" icon={<User size={16} />} label="My Profile" />
                    <ProfileLink href="/admin/settings" icon={<Shield size={16} />} label="Security" />
                    <ProfileLink href="/admin/activity" icon={<Clock size={16} />} label="Login History" />
                  </div>

                  <div className="pt-2 px-2 border-t border-slate-50">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8 custom-scrollbar">
          {children}
          
          <footer className="mt-20 pb-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Globe size={12} />
              <p>&copy; 2026 JustDial Clone • All rights reserved</p>
            </div>
            <div className="flex gap-6 mt-4 md:mt-0 uppercase tracking-widest">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Support</span>
            </div>
          </footer>
        </main>
      </div>

      <style jsx global>{`
        @keyframes progress-fast {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress-fast {
          animation: progress-fast 0.6s ease-in-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

function NavItem({ href, icon, label, setIsNavigating }: any) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      onClick={() => { if (pathname !== href) setIsNavigating(true); }}
      className={`
        flex items-center gap-3 px-4 py-3.5 mx-2 rounded-xl text-[13px] font-semibold transition-all duration-300
        ${isActive 
          ? "bg-[#0073c1] text-white shadow-[0_10px_20px_-5px_rgba(0,115,193,0.4)] translate-x-1" 
          : "text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function NotificationRow({ icon, title, time, color }: any) {
    return (
        <div className="flex gap-4 p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors group">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${color} transition-transform group-hover:scale-110`}>
              {React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{title}</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-medium italic">
                <Clock size={10} /> {time}
              </p>
            </div>
        </div>
    )
}

function ProfileLink({ href, icon, label }: any) {
    return (
        <Link href={href} className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-[#0073c1] rounded-xl transition-all">
            {icon} {label}
        </Link>
    )
}