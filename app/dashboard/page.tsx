// app/dashboard/page.tsx

"use client";
import React, { useEffect, useState, useMemo } from "react";
import { 
  MessageSquare, Star, Settings, LogOut, ShieldCheck,
  Mail, Phone, Loader2, ExternalLink, Clock, TrendingUp, X, User as UserIcon, Save, Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti"; 

function useAnimatedCounter(targetValue: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetValue;
    if (start === end) {
      setCount(end);
      return;
    }

    let totalMiliseconds = duration;
    let incrementTime = (totalMiliseconds / (end || 1)) > 10 ? (totalMiliseconds / (end || 1)) : 10;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  return count;
}

function EditProfileModal({ isOpen, onClose, user, onUpdate }: any) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, name, phone }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem("jd_user", JSON.stringify(updatedUser));
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0073c1', '#10b981', '#fbbf24']
        });

        onUpdate(updatedUser);
        onClose();
      }
    } catch (err) {
      alert("Failed to sync profile updates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Identity Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                required value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number"
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#0073c1] text-white py-5 rounded-[2rem] font-black uppercase tracking-[3px] text-xs shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Sync Identity</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  const animatedEnquiryCount = useAnimatedCounter(enquiries.length);
  const animatedReviewCount = useAnimatedCounter(reviews.length);

  const categoryTrends = useMemo(() => {
    if (recentVisits.length === 0) return [];
    
    const counts = recentVisits.reduce((acc: any, item: any) => {
      const cat = item.categoryName || "Local Index";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts)
      .map(name => ({ name, count: counts[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); 
  }, [recentVisits]);

  useEffect(() => {
    const savedUser = localStorage.getItem("jd_user");
    const savedHistory = localStorage.getItem("jd_history");

    if (!savedUser) {
      router.push("/"); 
    } else {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchUserActivity(parsedUser.id);
      
      if (savedHistory) {
        setRecentVisits(JSON.parse(savedHistory));
      }
    }
  }, [router]);

  const fetchUserActivity = async (userId: string) => {
    try {
      setLoading(true);
      const [enqRes, revRes] = await Promise.all([
        fetch(`/api/user/enquiries?userId=${userId}`),
        fetch(`/api/user/reviews?userId=${userId}`) 
      ]);

      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (revRes.ok) setReviews(await revRes.json());
    } catch (err) {
      console.error("Failed to sync user activity from TiDB Cloud infrastructure.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jd_user");
    router.push("/");
    window.location.reload();
  };

  const handleClearHistory = () => {
    if (confirm("Clear your recently viewed history? This action cannot be reversed.")) {
      localStorage.removeItem("jd_history");
      setRecentVisits([]);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#0073c1] to-blue-400 flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-white ring-8 ring-blue-50 animate-in zoom-in duration-500">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                {user.name || "User Account"}
              </h1>
              <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 flex items-center gap-1">
                <ShieldCheck size={12} /> Verified Identity
              </span>
            </div>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-6">
              <p className="flex items-center gap-2 text-slate-500 font-bold text-sm lowercase">
                <Mail size={16} className="text-blue-500" /> {user.email}
              </p>
              {user.phone && (
                <p className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase">
                  <Phone size={16} className="text-emerald-500" /> +91 {user.phone}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsEditOpen(true)}
              className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-[#0073c1] hover:bg-blue-50 border border-slate-100 transition-all shadow-sm"
              title="Edit Profile"
             >
               <Settings size={22} />
             </button>
             <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-4 border border-red-100 text-red-500 font-black uppercase text-xs rounded-2xl hover:bg-red-50 transition-all active:scale-95 shadow-sm"
             >
               <LogOut size={16} /> Sign Out
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="md:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <MessageSquare className="text-[#0073c1]" /> Recent Enquiries
              </h2>
              
              {loading ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 flex flex-col items-center shadow-sm">
                  <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Syncing TiDB Nodes...</p>
                </div>
              ) : enquiries.length > 0 ? (
                <div className="space-y-4">
                  {enquiries.map((enq: any) => (
                    <div key={enq.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex justify-between items-center group hover:border-blue-200 transition-all animate-in slide-in-from-bottom-2 duration-300">
                      <div className="flex gap-4 items-center">
                         <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0073c1]">
                            <MessageSquare size={20} />
                         </div>
                         <div className="max-w-[250px]">
                            <p className="font-black text-slate-800 uppercase tracking-tighter text-lg truncate">
                                {enq.business?.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5 mt-1">
                              <Clock size={10} /> Sent {new Date(enq.createdAt).toLocaleDateString()}
                            </p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${enq.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {enq.status}
                         </span>
                         <Link href={`/business/${enq.businessId}`} className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
                            <ExternalLink size={18} />
                         </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="text-slate-300" size={24} />
                  </div>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No Active Enquiries</p>
                </div>
              )}
            </section>

            <section className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <Clock className="text-emerald-500" /> Recently Visited
                </h2>
                {recentVisits.length > 0 && (
                  <button 
                    onClick={handleClearHistory}
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-red-400 hover:text-red-600 transition-colors tracking-widest bg-red-50/50 px-4 py-2 rounded-xl border border-red-50"
                  >
                    <Trash2 size={12} /> Clear All
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentVisits.length > 0 ? recentVisits.map((item: any) => (
                  <Link 
                    key={item.id} 
                    href={`/business/${item.id}`}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg hover:border-emerald-200 transition-all group relative overflow-hidden"
                  >
                    <div className="relative z-10 flex justify-between items-center">
                      <div>
                        <p className="font-black text-slate-800 uppercase text-md tracking-tight truncate max-w-[160px]">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.city}</p>
                      </div>
                      <ExternalLink size={16} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Clock size={80} className="text-slate-900" />
                    </div>
                  </Link>
                )) : (
                  <div className="col-span-full bg-white p-10 rounded-[2.5rem] border border-dashed border-slate-100 text-center shadow-sm">
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Browsing history is currently empty.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Star className="text-amber-500" /> Personal Feedbacks
              </h2>
              
              {loading ? (
                <div className="h-20 flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" /></div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev: any) => (
                    <div key={rev.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg flex justify-between items-start group hover:border-amber-100 transition-all">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-800 uppercase tracking-tighter text-md">{rev.business?.name}</p>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-500 text-sm font-medium italic leading-relaxed">"{rev.comment}"</p>
                        <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest mt-2">
                           Published {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={`/business/${rev.businessId}`} className="text-slate-300 hover:text-amber-500 transition-colors">
                        <ExternalLink size={16}/>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-10 rounded-[2.5rem] border border-dashed border-slate-200 text-center shadow-sm">
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Share your expert opinion on businesses.</p>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2 px-1">
              <TrendingUp className="text-indigo-500" /> Metrics
            </h2>
            
            <div className="space-y-4">
              <StatItem label="Active Enquiries" value={animatedEnquiryCount} color="blue" />
              <StatItem label="Total Reviews" value={animatedReviewCount} color="amber" />
              <StatItem label="Profile Health" value="100%" color="emerald" />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-800 flex items-center gap-2">
                <Star size={14} className="text-indigo-500" fill="currentColor" /> Interest Trends
              </h3>
              <div className="space-y-5">
                {categoryTrends.length > 0 ? categoryTrends.map((trend, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-tight">{trend.name}</span>
                      <span className="text-[10px] font-black text-blue-600">{trend.count} Visits</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${(trend.count / (recentVisits.length || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                )) : (
                  <p className="text-[10px] font-bold text-slate-400 uppercase italic">Browse categories to see trends</p>
                )}
              </div>
            </div>

            <div className="bg-[#0f172a] p-8 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
               <Settings className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 group-hover:rotate-90 transition-transform duration-1000" />
               <h3 className="text-xs font-black uppercase tracking-widest mb-2 italic tracking-tighter">TiDB Cloud Status</h3>
               <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase">
                 Identity & data secured via secure serverless infrastructure.
               </p>
               <div className="mt-6 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Real-time Encrypted</span>
               </div>
            </div>
          </div>

        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        user={user}
        onUpdate={(updatedUser: any) => setUser(updatedUser)}
      />
    </div>
  );
}

function StatItem({ label, value, color }: any) {
  const colors: any = {
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
  };
  return (
    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-xl flex justify-between items-center group hover:scale-[1.02] transition-transform">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={`px-4 py-1.5 rounded-xl font-black text-sm border ${colors[color]}`}>{value}</span>
    </div>
  );
}