// components/SearchHero.tsx

"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, MapPin, Mic, ChevronRight, ChevronLeft, 
  Home as HomeIcon, Briefcase, MessageCircle, Mail, User 
} from "lucide-react";

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export default function SearchHero() {
  const words = ["Products & Services", "B2B Suppliers", "Real Estate Agents", "Doctors"];
  const [index, setIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const banners = [
    "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/banner_bills_2024.webp",
    "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/banner_interiordesigners_2024.webp"
  ];

  const categories = [
    { title: "B2B", desc: "Quick Quotes", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/b2b_square_hotkey.webp", color: "bg-[#0073c1]" },
    { title: "REPAIRS & SERVICES", desc: "Get Nearest Vendor", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/repair_square_hotkey.webp", color: "bg-[#253d82]" },
    { title: "REAL ESTATE", desc: "Finest Agents", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/realestate_square_hotkey.webp", color: "bg-[#7b61ff]" },
    { title: "DOCTORS", desc: "Book Now", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/doctor_square_hotkey.webp", color: "bg-[#008d48]" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % words.length), 3000);
    return () => clearInterval(timer);
  }, [words.length]);

  const handleMic = () => {
    if (typeof window !== "undefined") {
      const MyWindow = window as unknown as IWindow;
      const SpeechRecognition = MyWindow.SpeechRecognition || MyWindow.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert("Browser support not found");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  return (
    <section className="relative w-full bg-white pb-20 md:pb-10 font-sans">
      <div className="max-w-[1300px] mx-auto px-4 pt-6">
        
        <div className="h-15 flex items-center mb-4 overflow-hidden">
          <h1 className="text-xl md:text-[26px] text-gray-800">
            Search across <span className="font-bold text-black">‘5.9 Crore+’</span>{" "}
            <span className="text-[#0073c1] font-bold inline-block transition-opacity duration-500">
              {words[index]}
            </span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
          <div className="flex items-center px-4 py-3 bg-white border-b md:border-b-0 md:border-r md:w-1/3">
            <MapPin size={18} className="text-gray-400 mr-2 shrink-0" />
            <input className="outline-none w-full text-sm text-gray-700" placeholder="Shiv Colony-Faridabad Sect" />
          </div>
          <div className="flex items-center px-4 py-3 bg-white flex-1">
            <input className="outline-none w-full text-sm text-gray-700" placeholder={`Search for ${words[index]}...`} />
            <div className="flex items-center gap-4">
              <Mic 
                onClick={handleMic}
                className={`cursor-pointer transition-colors ${isListening ? "text-red-500 animate-pulse" : "text-blue-500"}`} 
                size={20} 
              />
              <button className="bg-[#ff5a00] p-2.5 rounded-lg text-white hover:bg-[#e65100] transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-auto lg:h-[280px]">
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden group border border-gray-100 h-[200px] lg:h-full">
            <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {banners.map((src, i) => (
                <img key={i} src={src} className="w-full h-full object-fill shrink-0" alt="Special Offers" />
              ))}
            </div>
            
            <button onClick={() => setCurrentSlide(prev => (prev === 0 ? banners.length - 1 : prev - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrentSlide(prev => (prev + 1) % banners.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md">
              <ChevronRight size={18} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${currentSlide === i ? "bg-white w-4" : "bg-white/50 w-1.5"}`} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-3 h-full">
            {categories.map((cat, i) => (
              <div key={i} className={`${cat.color} relative rounded-2xl p-4 text-white overflow-hidden group cursor-pointer h-[150px] lg:h-full transition-transform active:scale-95 shadow-sm`}>
                <div className="relative z-10">
                  <h3 className="font-bold text-[13px] md:text-sm leading-tight uppercase">{cat.title}</h3>
                  <p className="text-[10px] opacity-80">{cat.desc}</p>
                </div>
                <img 
                  src={cat.img} 
                  className="absolute bottom-0 right-0 w-[85%] h-[70%] object-contain object-right-bottom transition-transform duration-500 group-hover:scale-105" 
                  alt={cat.title}
                />
                <div className="absolute bottom-3 left-3 bg-white/20 p-1 rounded-md">
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 flex justify-around items-center z-[60] md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <NavItem icon={<HomeIcon size={22} />} label="Home" active />
        <NavItem icon={<Briefcase size={22} />} label="B2B" />
        
        <div className="relative -top-5">
          <div className="bg-[#25d366] p-3 rounded-full shadow-lg border-4 border-white active:scale-90 transition-transform">
            <MessageCircle size={26} className="text-white" />
          </div>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-medium">Chat</span>
        </div>

        <NavItem icon={<Mail size={22} />} label="Leads" />
        <NavItem icon={<User size={22} />} label="Account" />
      </nav>
    </section>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center ${active ? "text-[#0073c1]" : "text-gray-500"}`}>
      {icon}
      <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{label}</span>
    </div>
  );
}