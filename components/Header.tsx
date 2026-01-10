"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Languages, ChevronDown, Mail, Megaphone, 
  LineChart, Bell, Menu, X, Briefcase, TrendingUp, Search, Mic 
} from "lucide-react";

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLangExpand, setIsMobileLangExpand] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setIsLangOpen(false);
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) setIsNotifyOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white font-sans">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 h-14 md:h-16">
        
        {/* --- LOGO SECTION --- */}
        <div className="flex items-center shrink-0">
          <Image
            src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg"
            alt="Justdial" width={120} height={38} className="w-24 md:w-32 cursor-pointer"
          />
        </div>

        {/* --- RIGHT SECTION (Search, Nav, Bell, Login) --- */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
          
          {/* 1. Search Icon (Visible on Both Mobile & Desktop) */}
          <div 
            className="p-2 cursor-pointer text-slate-600 hover:bg-gray-100 rounded-full transition" 
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={22} />
          </div>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-[14px] text-gray-700 font-normal">
            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <div onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1 cursor-pointer text-blue-600 font-medium hover:bg-blue-50 px-2 py-1 rounded transition">
                <Languages size={18} />
                <span>EN</span>
                <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </div>
              {isLangOpen && (
                <div className="absolute top-10 right-0 w-32 bg-white border rounded-lg shadow-xl py-2 z-50">
                  {['English', 'Hindi', 'Marathi', 'Gujarati'].map(l => (
                    <div key={l} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700">{l}</div>
                  ))}
                </div>
              )}
            </div>

            <span className="cursor-pointer hover:text-blue-600 transition">We are Hiring</span>
            <span className="cursor-pointer hover:text-blue-600 transition flex items-center gap-1">
               Investor Relations
            </span>
            
            <div className="relative flex items-center gap-1 cursor-pointer hover:text-blue-600 text-slate-600 transition">
              <Mail size={18} /> <span>Leads</span>
              <span className="absolute -top-1 left-3 h-2 w-2 rounded-full bg-red-600 border border-white"></span>
            </div>

            <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 text-slate-600 transition"><Megaphone size={18} /> <span>Advertise</span></div>

            <div className="flex items-center gap-1 cursor-pointer group">
              <LineChart size={18} className="text-slate-600" /> <span className="group-hover:text-blue-600 font-medium">Free Listing</span>
              <span className="ml-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded uppercase">Business</span>
            </div>
          </nav>

          {/* 3. Bell Icon / Notifications (Desktop & Mobile) */}
          <div className="relative" ref={notifyRef}>
            <div 
              className="p-2 cursor-pointer text-slate-600 hover:bg-gray-100 rounded-full transition" 
              onClick={() => setIsNotifyOpen(!isNotifyOpen)}
            >
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-white"></span>
            </div>
            
            {isNotifyOpen && (
              <div className="fixed right-4 top-14 md:absolute md:top-12 md:right-0 w-[280px] bg-white border rounded-xl shadow-2xl z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b font-bold bg-gray-50 flex justify-between items-center text-sm">
                  Notifications 
                  <X size={16} className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setIsNotifyOpen(false)} />
                </div>
                <div className="p-8 text-center text-sm text-gray-400">No new notifications</div>
              </div>
            )}
          </div>

          {/* 4. Login Button (Hidden on very small screens) */}
          <button className="hidden sm:block bg-[#0073c1] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition shadow-sm active:scale-95">
            Login / Sign Up
          </button>

          {/* 5. Mobile Menu Toggle */}
          <div className="xl:hidden p-1 cursor-pointer hover:bg-gray-100 rounded-lg transition" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={30} className="text-slate-600" />
          </div>
        </div>
      </div>

      {/* --- FULL-SCREEN SEARCH POPUP --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] bg-white animate-in slide-in-from-bottom duration-300">
          <div className="p-4 border-b flex items-center gap-3 max-w-[1400px] mx-auto">
            <X size={26} className="text-slate-500 cursor-pointer hover:text-black" onClick={() => setIsSearchOpen(false)} />
            <div className="flex-1 relative">
              <input 
                autoFocus 
                type="text" 
                placeholder="Search across 5.9 Crore+ Products..." 
                className="w-full bg-gray-100 rounded-lg py-3 pl-4 pr-12 text-sm outline-none focus:ring-1 focus:ring-blue-500" 
              />
              <Mic size={20} className="absolute right-3 top-3 text-[#0073c1] cursor-pointer" />
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Popular Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Restaurants', 'Hotels', 'Doctors', 'Rent & Hire'].map((cat) => (
                <div key={cat} className="flex items-center gap-2 p-3 border border-gray-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 transition cursor-pointer">
                   <Search size={14} className="text-slate-400" /> {cat}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE SIDE MENU --- */}
      <div className={`fixed inset-0 z-[160] xl:hidden transition-all ${isMobileMenuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="flex justify-between items-center px-6 py-5 border-b shrink-0 bg-white">
            <Image src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg" alt="JD" width={100} height={30} className="w-24" />
            <X size={28} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 cursor-pointer" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
            <div onClick={() => setIsMobileLangExpand(!isMobileLangExpand)} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl text-[#0073c1] font-semibold border border-blue-100 cursor-pointer mb-2">
              <Languages size={22} />
              <span className="flex-1">Language: English</span>
              <ChevronDown size={18} className={`transition-transform ${isMobileLangExpand ? 'rotate-180' : ''}`} />
            </div>
            
            {isMobileLangExpand && (
              <div className="ml-10 flex flex-col gap-4 py-2 mb-4 border-l-2 border-blue-50 pl-4">
                {['English', 'Hindi', 'Marathi', 'Gujarati'].map(l => <div key={l} className="text-slate-600 text-sm font-medium cursor-pointer hover:text-blue-600">{l}</div>)}
              </div>
            )}

            <div className="flex flex-col">
              {[
                { icon: <Briefcase size={20} />, label: "We are Hiring" },
                { icon: <TrendingUp size={20} />, label: "Investor Relations" },
                { icon: <Mail size={20} />, label: "Leads" },
                { icon: <Megaphone size={20} />, label: "Advertise" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-slate-50 text-slate-700 font-medium active:bg-slate-50 px-2 rounded-lg transition">
                  <span className="text-slate-400">{item.icon}</span> {item.label}
                </div>
              ))}
              <div className="flex items-center gap-4 py-5 text-red-600 font-bold border-b border-slate-50 px-2">
                <LineChart size={20} /> Free Listing
              </div>
            </div>
            <div className="h-24"></div>
          </div>

          <div className="sticky bottom-0 left-0 right-0 p-4 border-t bg-white shrink-0 z-30 pb-10">
            <button className="bg-[#0073c1] text-white w-full py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center">
              Login / Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}