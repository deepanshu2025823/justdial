// app/admin/sidebar.tsx

"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Store, Users, MessageSquare, 
  Settings, LogOut, Menu, Search, Bell, Layers, 
  ChevronDown, User, Shield, CheckCircle, AlertCircle, Clock
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);

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
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0f172a] text-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl border-r border-slate-800
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-[#0f172a]">
          <img 
            src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg" 
            alt="Justdial Admin" 
            className="h-8 w-auto brightness-0 invert" 
          />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Main Menu</p>
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem href="/admin/categories" icon={<Layers size={20} />} label="Categories" />
          <NavItem href="/admin/listings" icon={<Store size={20} />} label="Business Listings" />
          <NavItem href="/admin/users" icon={<Users size={20} />} label="User Management" />
          <NavItem href="/admin/leads" icon={<MessageSquare size={20} />} label="Leads & Enquiries" />
          
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6">System</p>
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[11px] font-medium text-slate-300 uppercase tracking-tighter">Live Database Connected</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-4 md:px-8 shadow-sm z-30 relative">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full w-64 lg:w-96 focus-within:ring-2 focus-within:ring-[#0073c1]/20 transition-all border border-transparent focus-within:border-[#0073c1]/30 group">
              <Search size={18} className="text-slate-400 group-focus-within:text-[#0073c1]" />
              <input 
                type="text" 
                placeholder="Search listings, users, leads..." 
                className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            
            <div className="relative" ref={notifyRef}>
              <button 
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                className={`relative p-2 rounded-full transition-colors ${isNotifyOpen ? 'bg-blue-50 text-[#0073c1]' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              {isNotifyOpen && (
                <div className="absolute right-0 top-14 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                    <button className="text-[10px] text-[#0073c1] font-semibold hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {[
                      { icon: <User size={14} />, title: "New User Registered", time: "2 min ago", color: "bg-blue-100 text-blue-600" },
                      { icon: <AlertCircle size={14} />, title: "Database High Load", time: "15 min ago", color: "bg-red-100 text-red-600" },
                      { icon: <CheckCircle size={14} />, title: "Backup Completed", time: "1 hour ago", color: "bg-green-100 text-green-600" },
                      { icon: <MessageSquare size={14} />, title: "New Enquiry Received", time: "2 hours ago", color: "bg-purple-100 text-purple-600" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{item.title}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-50 text-center">
                    <button className="text-xs text-slate-500 hover:text-slate-800 font-medium py-1">View All Activity</button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 p-1.5 pr-3 rounded-full border transition-all ${isProfileOpen ? 'bg-slate-50 border-slate-200' : 'border-transparent hover:bg-slate-50'}`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0073c1] to-[#005a9c] flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                  A
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-700">Super Admin</p>
                  <p className="text-[10px] text-slate-500">View Profile</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-14 w-60 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-800">Administrator</p>
                    <p className="text-xs text-slate-500 truncate">mr.deepanshujoshi@gmail.com</p>
                  </div>
                  
                  <div className="py-1">
                    <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-[#0073c1] transition-colors">
                      <User size={16} /> My Profile
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-[#0073c1] transition-colors">
                      <Shield size={16} /> Security Settings
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-50">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 custom-scrollbar">
          {children}
          
          <footer className="mt-10 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-2">
            <p>&copy; 2008-2026 JustDial . All rights reserved</p>
            <div className="flex gap-6">
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Support</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`
        flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive 
          ? "bg-[#0073c1] text-white shadow-lg shadow-blue-900/30 translate-x-1" 
          : "text-slate-400 hover:bg-[#1e293b] hover:text-white hover:translate-x-1"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}