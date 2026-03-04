// components/Header.tsx

"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { 
  Languages, ChevronDown, Mail, Megaphone, 
  LineChart, Bell, Menu, X, Briefcase, TrendingUp, Search, Mic,
  Phone, ArrowRight, Loader2, User, LogOut, LayoutDashboard, Clock, MessageSquare, Volume2, Send
} from "lucide-react";

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLangExpand, setIsMobileLangExpand] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<"input" | "otp">("input");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState(""); 
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); 
  const [currentUser, setCurrentUser] = useState<any>(null); 
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const langRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("jd_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      
      requestPushPermission();
      
      fetchNotifications(parsedUser.id);
      
      const interval = setInterval(() => fetchNotifications(parsedUser.id), 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/enquiries?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        const pendingItems = data.filter((e: any) => e.status === "PENDING");
        
        if (pendingItems.length > unreadCount && unreadCount !== 0) {
          playLeadSound();
          triggerBrowserPush(pendingItems[0]);
        }
        
        setNotifications(data.slice(0, 5)); 
        setUnreadCount(pendingItems.length);
      }
    } catch (err) {
      console.error("Notification Engine Sync Failed");
    }
  };

  const playLeadSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio blocked by browser"));
    }
  };

  const requestPushPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  const triggerBrowserPush = (lead: any) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Lead Alert!", {
        body: `${lead.name} has sent a new enquiry for ${lead.business?.name || 'your business'}.`,
        icon: "https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg"
      });
    }
  };

  const handleQuickReply = async (enquiryId: string) => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESOLVED", reply: replyText })
      });
      if (res.ok) {
        setReplyingTo(null);
        setReplyText("");
        fetchNotifications(currentUser.id);
        alert("Lead marked as resolved with your reply.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getSentiment = (msg: string) => {
    if (!msg) return { text: "COLD", bg: "bg-slate-50 text-slate-400 border-slate-200" };
    const hotWords = ["urgent", "buy", "price", "cost", "book", "call", "asap", "immediate", "fast", "need"];
    const isHot = hotWords.some(w => msg.toLowerCase().includes(w));
    
    return isHot 
      ? { text: "HOT LEAD", bg: "bg-red-50 text-red-600 border-red-200" } 
      : { text: "GENERAL", bg: "bg-slate-50 text-slate-500 border-slate-200" };
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setIsLangOpen(false);
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) setIsNotifyOpen(false);
      if (userRef.current && !userRef.current.contains(event.target as Node)) setIsUserDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen || isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen, isSearchOpen, isAuthModalOpen]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleAuthSubmit = async () => {
    if (!identifier) return alert("Please enter your details");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: identifier, action: "SEND_OTP" }),
      });
      if (res.ok) {
        setAuthStep("otp");
      } else {
        alert("Failed to send code. Please try again.");
      }
    } catch (err) {
      alert("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) return alert("Enter full 6-digit code");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: identifier, otp: finalOtp, action: "VERIFY_OTP" }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("jd_user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setIsAuthModalOpen(false);
        setOtp(["", "", "", "", "", ""]);
        fetchNotifications(data.user.id);
      } else {
        alert("Invalid OTP code.");
      }
    } catch (err) {
      alert("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jd_user");
    setCurrentUser(null);
    setIsUserDropdownOpen(false);
    setUnreadCount(0);
    setNotifications([]);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white font-sans">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 h-14 md:h-16">
        
        <div className="flex items-center shrink-0">
          <Link href="/">
            <Image
              src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg"
              alt="Justdial" 
              width={120} 
              height={38} 
              className="w-24 md:w-32 cursor-pointer"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
          
          <div 
            className="p-2 cursor-pointer text-slate-600 hover:bg-gray-100 rounded-full transition" 
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={22} />
          </div>

          <nav className="hidden xl:flex items-center gap-6 text-[14px] text-gray-700 font-normal">
            <div className="relative" ref={langRef}>
              <div onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1 cursor-pointer text-blue-600 font-medium hover:bg-blue-50 px-2 py-1 rounded transition">
                <Languages size={18} />
                <span>EN</span>
                <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </div>
              {isLangOpen && (
                <div className="absolute top-10 right-0 w-32 bg-white border rounded-lg shadow-xl py-2 z-50 animate-in fade-in">
                  {['English', 'Hindi', 'Marathi', 'Gujarati'].map(l => (
                    <div key={l} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700">{l}</div>
                  ))}
                </div>
              )}
            </div>

            <span className="cursor-pointer hover:text-blue-600 transition">We are Hiring</span>
            <span className="cursor-pointer hover:text-blue-600 transition">Investor Relations</span>
            
            <Link href="/dashboard" className="relative flex items-center gap-1 cursor-pointer hover:text-blue-600 text-slate-600">
              <Mail size={18} /> <span>Leads</span>
              {unreadCount > 0 && <span className="absolute -top-1 left-3 h-2 w-2 rounded-full bg-red-600 border border-white animate-pulse"></span>}
            </Link>

            <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 text-slate-600 transition"><Megaphone size={18} /> <span>Advertise</span></div>

            <div className="flex items-center gap-1 cursor-pointer group">
              <LineChart size={18} className="text-slate-600" /> <span className="group-hover:text-blue-600 font-medium text-xs font-black uppercase tracking-tighter">Free Listing</span>
              <span className="ml-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded uppercase tracking-tighter">Business</span>
            </div>
          </nav>

          <div className="relative" ref={notifyRef}>
            <div 
              className="p-2 cursor-pointer text-slate-600 hover:bg-gray-100 rounded-full transition relative" 
              onClick={() => setIsNotifyOpen(!isNotifyOpen)}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-600 border-2 border-white text-[8px] font-black text-white flex items-center justify-center animate-bounce shadow-sm">{unreadCount}</span>
              )}
            </div>
            
            {isNotifyOpen && (
              <div className="fixed right-4 top-14 md:absolute md:top-12 md:right-0 w-[340px] bg-white border rounded-[1.5rem] shadow-2xl z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b font-black bg-slate-50 flex justify-between items-center text-[10px] uppercase tracking-[2px] text-slate-400">
                  Inbox Stream ({notifications.length})
                  <div className="flex items-center gap-2"><Volume2 size={12} className="text-emerald-500" /><X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setIsNotifyOpen(false)} /></div>
                </div>
                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => {
                      const sentiment = getSentiment(n.message); 
                      return (
                        <div key={n.id} className={`p-4 border-b border-slate-50 transition ${replyingTo === n.id ? 'bg-blue-50/50' : 'hover:bg-blue-50'}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center ${n.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}><MessageSquare size={16} /></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="text-xs font-black text-slate-800 uppercase tracking-tighter line-clamp-1">{n.business?.name || 'Local Lead'}</p>
                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border tracking-widest ${sentiment.bg}`}>{sentiment.text}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mt-1 italic">"{n.message.substring(0, 45)}..."</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-[8px] text-slate-400 font-black uppercase flex items-center gap-1.5"><Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                {n.status === 'PENDING' && replyingTo !== n.id && (
                                  <button onClick={() => setReplyingTo(n.id)} className="text-[9px] font-black text-[#0073c1] uppercase bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 transition-colors hover:bg-blue-100">Quick Reply</button>
                                )}
                              </div>
                            </div>
                          </div>
                          {replyingTo === n.id && (
                            <div className="mt-4 flex gap-2 animate-in slide-in-from-top-2">
                              <input autoFocus value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 ring-blue-100 font-medium" placeholder="Type response..." />
                              <button onClick={() => handleQuickReply(n.id)} className="bg-[#0073c1] text-white p-2 rounded-xl active:scale-90 transition-transform"><Send size={14} /></button>
                              <button onClick={() => setReplyingTo(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : <div className="p-16 text-center flex flex-col items-center gap-3"><Bell size={40} className="text-slate-100" /><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No activity found</p></div>}
                </div>
                <Link href="/dashboard" className="block p-4 text-center text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 border-t border-blue-100 hover:bg-blue-100 transition-colors">Open Full Dashboard</Link>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="relative" ref={userRef}>
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 pr-3 rounded-full hover:bg-slate-100 transition shadow-sm active:scale-95"
              >
                <div className="w-8 h-8 rounded-full bg-[#0073c1] text-white flex items-center justify-center font-black text-sm uppercase shadow-sm border-2 border-white">
                  {currentUser.email?.charAt(0)}
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white border rounded-[1.5rem] shadow-2xl py-2 z-[150] animate-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Identity Confirmed</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser.email}</p>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-xs font-bold text-slate-600 transition">
                    <LayoutDashboard size={16} /> My Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-xs font-bold text-red-500 transition border-t border-slate-50">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => { setIsAuthModalOpen(true); setAuthStep("input"); }}
              className="hidden sm:block bg-[#0073c1] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg active:scale-95 shadow-blue-50"
            >
              Login / Sign Up
            </button>
          )}

          <div className="xl:hidden p-1 cursor-pointer hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28} className="text-slate-600" />
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] bg-white animate-in slide-in-from-bottom duration-300 flex flex-col">
          <div className="p-4 border-b flex items-center gap-3 max-w-[1400px] mx-auto w-full">
            <X size={26} className="text-slate-500 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setIsSearchOpen(false)} />
            <div className="flex-1 relative">
              <input autoFocus type="text" placeholder="Search across 5.9 Crore+ Products..." className="w-full bg-gray-100 rounded-lg py-3 pl-4 pr-12 text-base outline-none focus:ring-1 focus:ring-blue-500 text-black font-bold shadow-inner" />
              <Mic size={20} className="absolute right-3 top-3.5 text-[#0073c1] cursor-pointer" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-w-[1400px] mx-auto w-full p-5">
            <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">Popular Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {['Restaurants', 'Hotels', 'Doctors', 'Real Estate'].map((cat) => (
                <div key={cat} className="flex items-center gap-3 p-5 border border-slate-100 rounded-2xl text-sm font-black uppercase tracking-tighter text-slate-700 hover:bg-blue-50 transition cursor-pointer shadow-sm">
                   <div className="bg-slate-50 p-2 rounded-lg"><Search size={14} className="text-slate-400" /></div>
                   {cat}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsAuthModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition text-slate-400">
              <X size={20} />
            </button>
            <div className="p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                  {authStep === "input" ? "Identity Portal" : "Security Check"}
                </h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mt-2">
                  {authStep === "input" ? "Verified access only" : `Enter 6-digit code sent to ${identifier}`}
                </p>
              </div>

              {authStep === "input" ? (
                <div className="space-y-6">
                  <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button onClick={() => setAuthMethod("phone")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${authMethod === "phone" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Phone</button>
                    <button onClick={() => setAuthMethod("email")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${authMethod === "email" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Email</button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{authMethod === "phone" ? <Phone size={20} /> : <Mail size={20} />}</div>
                    <input type={authMethod === "phone" ? "tel" : "email"} value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder={authMethod === "phone" ? "Mobile Number" : "Email ID"} className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm" />
                  </div>
                  <button onClick={handleAuthSubmit} disabled={loading || !identifier} className="w-full bg-[#0073c1] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[3px] text-[10px] shadow-xl hover:bg-blue-700 transition flex items-center justify-center gap-3 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Generate OTP <ArrowRight size={18} /></>}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="flex justify-between gap-2">{otp.map((digit, i) => (<input key={i} id={`otp-${i}`} maxLength={1} value={digit} onChange={(e) => handleOtpChange(e.target.value, i)} className="w-full h-14 border-2 border-slate-200 rounded-xl text-center text-xl font-black focus:border-[#0073c1] outline-none transition-all focus:bg-blue-50" />))}</div>
                   <button onClick={handleVerifyOTP} disabled={loading} className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[3px] text-[10px] shadow-xl flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2">
                     {loading ? <Loader2 className="animate-spin" size={18} /> : "Verify & Authorize"}
                   </button>
                   <p className="text-center text-[10px] font-black text-slate-400 uppercase cursor-pointer hover:text-blue-600" onClick={() => {setAuthStep("input"); setOtp(["","","","","",""])}}>Change Identity Details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`fixed inset-0 z-[160] xl:hidden transition-all ${isMobileMenuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex justify-between items-center px-6 py-5 border-b shrink-0 bg-white">
            <Image src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg" alt="JD" width={100} height={30} className="w-24" />
            <X size={28} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 cursor-pointer" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
            {currentUser && (
              <div className="p-4 bg-blue-50 rounded-2xl mb-4 border border-blue-100">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Session</p>
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser.email}</p>
              </div>
            )}
            <div onClick={() => setIsMobileLangExpand(!isMobileLangExpand)} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl text-[#0073c1] font-semibold border border-blue-100 cursor-pointer mb-2">
              <Languages size={22} />
              <span className="flex-1 text-sm">Language: English</span>
              <ChevronDown size={18} className={`transition-transform ${isMobileLangExpand ? 'rotate-180' : ''}`} />
            </div>
            
            {isMobileLangExpand && (
              <div className="ml-10 flex flex-col gap-4 py-2 mb-4 border-l-2 border-blue-50 pl-4">
                {['English', 'Hindi', 'Marathi', 'Gujarati'].map(l => <div key={l} className="text-slate-600 text-sm font-medium hover:text-blue-600 cursor-pointer">{l}</div>)}
              </div>
            )}

            <div className="flex flex-col">
              {[
                { icon: <Briefcase size={20} />, label: "We are Hiring" },
                { icon: <TrendingUp size={20} />, label: "Investor Relations" },
                { icon: <Mail size={20} />, label: "Leads" },
                { icon: <Megaphone size={20} />, label: "Advertise" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-slate-50 text-slate-700 font-medium px-2 rounded-lg transition cursor-pointer">
                  <span className="text-slate-400">{item.icon}</span> <span className="text-sm">{item.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-4 py-5 text-red-600 font-bold border-b border-slate-50 px-2 cursor-pointer">
                <LineChart size={20} /> <span className="text-sm">Free Listing</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50 shrink-0">
            {currentUser ? (
              <button onClick={handleLogout} className="bg-red-50 text-red-600 w-full py-4 rounded-xl font-bold active:scale-95 transition-transform text-sm uppercase tracking-widest border border-red-100">Sign Out</button>
            ) : (
              <button 
                onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                className="bg-[#0073c1] text-white w-full py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform text-base uppercase tracking-widest"
              >
                Login / Sign Up
              </button>
            )}
            <div className="h-4"></div> 
          </div>
        </div>
      </div>
    </header>
  );
}