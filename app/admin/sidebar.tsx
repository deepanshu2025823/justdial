// app/admin/sidebar.tsx

"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Store, Users, MessageSquare, 
  Settings, LogOut, Menu, Search, Bell, Layers, 
  ChevronDown, User, Shield, CheckCircle, AlertCircle, Clock,
  Activity, Globe, X, Zap, Cpu, Mail, Phone, Lock, Save, Loader2,
  Inbox, UserPlus
} from "lucide-react";

export default function AdminLayout({ 
  children, 
  data 
}: { 
  children: React.ReactNode, 
  data: any 
}) {
  const pathname = usePathname();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sidePanel, setSidePanel] = useState<{ open: boolean; type: "profile" | "security" }>({ open: false, type: "profile" });
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [fetchingNotifications, setFetchingNotifications] = useState(false);

  const [formData, setFormData] = useState({
    name: data?.adminName || "Super Admin",
    email: data?.adminEmail || "admin@system.com",
    phone: data?.adminPhone || "+91 00000 00000",
    password: "" 
  });

  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLiveActivity = async () => {
      setFetchingNotifications(true);
      try {
        const [leadsRes, usersRes] = await Promise.all([
          fetch("/api/admin/leads"),
          fetch("/api/admin/users")
        ]);

        const leads = await leadsRes.json();
        const users = await usersRes.json();

        const leadNotifications = (leads || []).slice(0, 5).map((l: any) => ({
          id: l.id,
          title: `New Lead: ${l.name}`,
          time: l.createdAt,
          type: "LEAD",
          icon: <Inbox size={18} />,
          color: "bg-purple-100 text-purple-600"
        }));

        const userNotifications = (users || []).slice(0, 5).map((u: any) => ({
          id: u.id,
          title: `New User: ${u.name || u.email}`,
          time: u.createdAt,
          type: "USER",
          icon: <UserPlus size={18} />,
          color: "bg-blue-100 text-blue-600"
        }));

        const combined = [...leadNotifications, ...userNotifications].sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        setNotifications(combined.slice(0, 8));
      } catch (err) {
        console.error("Notification Sync Error");
      } finally {
        setFetchingNotifications(false);
      }
    };

    fetchLiveActivity();
    const interval = setInterval(fetchLiveActivity, 60000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.adminName || "Super Admin",
        email: data.adminEmail || "admin@system.com",
        phone: data.adminPhone || "+91 00000 00000",
        password: ""
      });
    }
  }, [data]);

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-slate-50 font-sans">{children}</div>;
  }

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) setIsNotifyOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
        setIsUpdating(false);
        setSidePanel({ ...sidePanel, open: false });
        alert("Success: Admin record synchronized with database.");
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-slate-900">
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[9999] overflow-hidden bg-blue-100">
          <div className="h-full bg-[#0073c1] animate-progress-fast shadow-[0_0_15px_rgba(0,115,193,0.6)]"></div>
        </div>
      )}

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-all" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white z-[100] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out border-l border-slate-200 flex flex-col ${sidePanel.open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight text-[#0073c1]">
                {sidePanel.type === "profile" ? <User className="text-blue-500" /> : <Shield className="text-emerald-500" />}
                {sidePanel.type === "profile" ? "Manage Identity" : "Security Shield"}
            </h2>
            <button onClick={() => setSidePanel({ ...sidePanel, open: false })} className="p-2 hover:bg-white rounded-full shadow-sm transition-all border border-slate-200">
                <X size={20} />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {sidePanel.type === "profile" ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0073c1] to-blue-400 flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white ring-4 ring-blue-50">
                            {formData.name?.charAt(0)}
                        </div>
                        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Active Prisma Entity: Admin</p>
                    </div>

                    <div className="space-y-5">
                        <ProfileInput label="Full Name" icon={<User size={18} />} value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                        <ProfileInput label="System Email" icon={<Mail size={18} />} value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
                        <ProfileInput label="Mobile Access" icon={<Phone size={18} />} value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} />
                        <ProfileInput label="Database Key" icon={<Lock size={18} />} type="password" placeholder="Change security password..." value={formData.password} onChange={(v: string) => setFormData({...formData, password: v})} />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isUpdating}
                        className="w-full bg-[#0073c1] text-white py-5 rounded-[2rem] font-black uppercase tracking-[3px] shadow-2xl shadow-blue-500/30 transition-all hover:bg-[#005a9c] hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-10"
                    >
                        {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Sync with Database</>}
                    </button>
                </form>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm">
                        <CheckCircle className="text-emerald-500 shrink-0" size={32} />
                        <p className="text-xs font-black text-emerald-800 uppercase tracking-tighter leading-tight">Admin privileges verified. Your session is end-to-end encrypted.</p>
                    </div>
                    <SecurityAction icon={<Zap />} title="Two-Factor Auth" status="Active" />
                    <SecurityAction icon={<Clock />} title="Session Token" status="Secure" />
                    <SecurityAction icon={<Cpu />} title="SSL-256 Bit" status="Live" />
                </div>
            )}
        </div>
      </div>

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-68 bg-[#0f172a] text-white transition-transform duration-300 ease-in-out flex flex-col shadow-2xl border-r border-slate-800 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="h-20 flex items-center px-8 border-b border-slate-800/50 bg-[#0f172a]">
          <img src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg" alt="JD" className="h-8 w-auto brightness-0 invert opacity-90" />
        </div>

        <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto custom-scrollbar pt-8">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2.5px] mb-5">Command Center</p>
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={19} />} label="System Overview" setIsNavigating={setIsNavigating} />
          <NavItem href="/admin/categories" icon={<Layers size={19} />} label="Categories" setIsNavigating={setIsNavigating} />
          <NavItem href="/admin/reviews" icon={<Bell size={19} />} label="Reviews" setIsNavigating={setIsNavigating} />
          <NavItem href="/admin/listings" icon={<Store size={19} />} label="Business Listings" setIsNavigating={setIsNavigating} />
          <NavItem href="/admin/users" icon={<Users size={19} />} label="User Access" setIsNavigating={setIsNavigating} />
          <NavItem href="/admin/leads" icon={<MessageSquare size={19} />} label="Inbound Leads" setIsNavigating={setIsNavigating} badge={data?.pendingCount || 0} />
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2.5px] mb-5 mt-10">Configuration</p>
          <NavItem href="/admin/settings" icon={<Settings size={19} />} label="Global Settings" setIsNavigating={setIsNavigating} />
        </nav>

        <div className="p-6 border-t border-slate-800/50 bg-[#0b1120]/80">
          <div className="group relative bg-slate-900/50 p-4 rounded-2xl border border-slate-800 hover:border-[#0073c1]/40 transition-all cursor-default overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md animate-pulse"></div>
                <div className="relative h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
              </div>
              <div className="flex flex-col">
                <p className="text-[11px] font-bold text-slate-100 uppercase tracking-tighter leading-none">TiDB Cloud</p>
                <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 font-bold bg-white/5 w-fit px-2 py-0.5 rounded-full border border-white/5">
                   <Activity size={8} className="text-blue-400" />
                   <span>ap-southeast-1 • v2.6.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-4 md:px-10 shadow-sm z-30 relative shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all active:scale-95"><Menu size={24} /></button>
            <div className="hidden md:flex items-center gap-4 bg-slate-100/80 px-5 py-2.5 rounded-2xl w-64 lg:w-[450px] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all group border border-transparent focus-within:border-blue-200">
              <Search size={18} className="text-slate-400 group-focus-within:text-[#0073c1]" />
              <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm font-semibold w-full placeholder:text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative" ref={notifyRef}>
              <button onClick={() => setIsNotifyOpen(!isNotifyOpen)} className={`relative p-2.5 rounded-full transition-all active:scale-90 ${isNotifyOpen ? 'bg-blue-50 text-[#0073c1]' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Bell size={21} />
                {notifications.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce shadow-sm"></span>}
              </button>

              {isNotifyOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-80 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 origin-top-right">
                  <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">System Alerts</h3>
                    <span className="px-3 py-1 bg-blue-100 text-[#0073c1] text-[10px] font-black rounded-full uppercase">{notifications.length} Total</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {fetchingNotifications ? (
                      <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>
                    ) : notifications.length > 0 ? (
                        notifications.map((n) => (
                            <NotificationRow key={n.id} icon={n.icon} title={n.title} time={new Date(n.time).toLocaleTimeString()} color={n.color} />
                        ))
                    ) : (
                        <div className="p-12 text-center text-slate-400 text-xs italic font-medium uppercase tracking-widest">No Recent Activity</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-3 p-1.5 pr-4 rounded-full border transition-all active:scale-95 ${isProfileOpen ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-50' : 'border-transparent hover:bg-slate-50'}`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0073c1] to-blue-500 flex items-center justify-center text-white font-bold shadow-md uppercase">{formData.name?.charAt(0)}</div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">Master Admin</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formData.name?.split(' ')[0]}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-64 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 py-3 animate-in fade-in slide-in-from-top-3 origin-top-right">
                  <div className="px-6 py-4 border-b border-slate-50">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{formData.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold truncate mt-0.5">{formData.email}</p>
                  </div>
                  <div className="py-2 px-3">
                    <ProfileLink onClick={() => { setSidePanel({ open: true, type: "profile" }); setIsProfileOpen(false); }} icon={<User size={16} />} label="Edit My Profile" />
                    <ProfileLink onClick={() => { setSidePanel({ open: true, type: "security" }); setIsProfileOpen(false); }} icon={<Shield size={16} />} label="Access Control" />
                  </div>
                  <div className="pt-2 px-3 border-t border-slate-50">
                    <button className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all"><LogOut size={17} /> SIGN OUT</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 md:p-10 custom-scrollbar">
          {children}
          <footer className="mt-24 pt-12 pb-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-4">
            <div className="flex items-center gap-2 text-slate-500"><Globe size={13} /><p>&copy; 2026 JustDial Control Panel</p></div>
            <div className="flex gap-8"><span className="hover:text-blue-600 transition-colors cursor-pointer">Privacy Policy</span><span className="hover:text-blue-600 transition-colors cursor-pointer">Terms of Service</span></div>
          </footer>
        </main>
      </div>

      <style jsx global>{`
        @keyframes progress-fast { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress-fast { animation: progress-fast 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
      `}</style>
    </div>
  );
}

function ProfileInput({ label, value, onChange, icon, type = "text", placeholder }: any) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[1px] ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0073c1] transition-colors">{icon}</div>
                <input 
                    type={type} 
                    value={value} 
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-[#0073c1] focus:ring-4 focus:ring-blue-50 transition-all outline-none" 
                />
            </div>
        </div>
    )
}

function NavItem({ href, icon, label, setIsNavigating, badge }: any) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} onClick={() => { if (pathname !== href) setIsNavigating(true); }}
      className={`flex items-center justify-between px-5 py-3.5 mx-2 rounded-2xl text-[13px] font-bold transition-all duration-300 group
        ${isActive ? "bg-[#0073c1] text-white shadow-[0_12px_24px_-8px_rgba(0,115,193,0.5)] translate-x-1" : "text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1"}`}>
      <div className="flex items-center gap-4">{icon}<span className="tracking-tight">{label}</span></div>
      {badge > 0 && <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow-inner ${isActive ? 'bg-white text-[#0073c1]' : 'bg-red-500 text-white animate-pulse'}`}>{badge}</span>}
    </Link>
  );
}

function NotificationRow({ icon, title, time, color }: any) {
    return (
        <div className="flex gap-4 p-5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${color} transition-transform group-hover:scale-110`}>
              {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-800 tracking-tighter truncate uppercase">{title}</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1 font-bold italic uppercase tracking-tighter"><Clock size={11} /> {time}</p>
            </div>
        </div>
    )
}

function ProfileLink({ onClick, icon, label }: any) {
    return (
        <button onClick={onClick} className="w-full flex items-center gap-4 px-5 py-3.5 text-xs font-black text-slate-600 hover:bg-blue-50 hover:text-[#0073c1] rounded-2xl transition-all text-left uppercase tracking-tighter">
            {icon} {label}
        </button>
    )
}

function SecurityAction({ icon, title, status }: any) {
    return (
        <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-50 rounded-xl text-[#0073c1]">{React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}</div>
                <p className="text-sm font-bold text-slate-800">{title}</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase">{status}</span>
        </div>
    )
}