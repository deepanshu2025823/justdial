// components/SearchHero.tsx

"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Search, MapPin, Mic, ChevronRight, ChevronLeft, 
  Home as HomeIcon, Briefcase, MessageCircle, Mail, User, Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export default function SearchHero() {
  const router = useRouter();
  const words = ["Products & Services", "B2B Suppliers", "Real Estate Agents", "Doctors"];
  const [index, setIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isListening, setIsListening] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Shiv Colony-Faridabad Sect");
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); 

  const defaultColors = ["bg-[#0073c1]", "bg-[#253d82]", "bg-[#7b61ff]", "bg-[#008d48]", "bg-[#ff5a00]"];

  useEffect(() => {
    const fetchDynamicContent = async () => {
      try {
        const bannerRes = await fetch("/api/banners");
        if (bannerRes.ok) {
          const bannerData = await bannerRes.json();
          if (bannerData && bannerData.length > 0) {
            setBanners(bannerData.filter((b: any) => b.isActive));
          }
        }

        const catRes = await fetch("/api/categories");
        if (catRes.ok) {
           const catData = await catRes.json();
           if (catData && catData.length > 0) {
               setCategories(catData.slice(0, 4));
           }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic content");
      }
    };
    fetchDynamicContent();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % words.length), 3000);
    return () => clearInterval(timer);
  }, [words.length]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        setShowPopup(false);
        return;
      }

      setIsSuggesting(true);
      setShowPopup(true);
      try {
        const res = await fetch(`/api/businesses/search?q=${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.slice(0, 6));
        }
      } catch (err) {
        console.error("Suggestion fetch failed");
      } finally {
        setIsSuggesting(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowPopup(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(location)}`);
  };

  const handleMic = () => {
    if (typeof window !== "undefined") {
      const MyWindow = window as unknown as IWindow;
      const SpeechRecognition = MyWindow.SpeechRecognition || MyWindow.webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Browser support not found");

      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        router.push(`/search?q=${encodeURIComponent(transcript)}&city=${encodeURIComponent(location)}`);
      };
      recognition.start();
    }
  };

  const handleBannerClick = (link?: string) => {
    if (link && link.trim() !== "") {
      router.push(link);
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

        <div className="relative" ref={suggestionRef}>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm focus-within:shadow-md transition-shadow relative z-20">
            <div className="flex items-center px-4 py-3 bg-white border-b md:border-b-0 md:border-r md:w-1/3 group">
              <MapPin size={18} className="text-gray-400 mr-2 shrink-0 group-focus-within:text-blue-500" />
              <input 
                className="outline-none w-full text-sm text-gray-700 font-medium" 
                placeholder="Shiv Colony-Faridabad Sect" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex items-center px-4 py-3 bg-white flex-1">
              <input 
                className="outline-none w-full text-sm text-gray-700 font-medium" 
                placeholder={`Search for ${words[index]}...`} 
                value={searchQuery}
                onFocus={() => searchQuery.length >= 2 && setShowPopup(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-4">
                <Mic 
                  onClick={handleMic}
                  className={`cursor-pointer transition-colors ${isListening ? "text-red-500 animate-pulse" : "text-blue-500 hover:text-blue-700"}`} 
                  size={20} 
                />
                <button 
                  type="submit"
                  className="bg-[#ff5a00] p-2.5 rounded-lg text-white hover:bg-[#e65100] transition-all active:scale-90 shadow-md"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </form>

          {showPopup && (
            <div className="absolute top-[52px] md:top-[52px] left-0 md:left-auto md:right-0 w-full md:w-2/3 bg-white z-[100] rounded-b-2xl shadow-2xl border border-t-0 border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 bg-slate-50/50 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instant Results</span>
                {isSuggesting && <Loader2 size={14} className="animate-spin text-blue-500" />}
              </div>
              
              <div className="max-h-[350px] overflow-y-auto">
                {suggestions.length > 0 ? (
                  suggestions.map((biz) => (
                    <div 
                      key={biz.id} 
                      onClick={() => router.push(`/business/${biz.id}`)}
                      className="p-4 flex items-center gap-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200 group-hover:border-blue-200 transition-colors">
                        {biz.category?.image ? (
                           <img src={biz.category.image} alt={biz.category?.name} className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-xs font-black text-[#0073c1] uppercase">
                             {biz.name.substring(0, 2)}
                           </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">{biz.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase mt-0.5">
                          {biz.city} • {biz.category?.name}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))
                ) : !isSuggesting ? (
                  <div className="p-10 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching business found</p>
                  </div>
                ) : null}
              </div>
              <div className="p-3 bg-blue-50 text-center border-t border-blue-100">
                 <button onClick={handleSearch} className="text-[10px] font-black text-[#0073c1] uppercase tracking-widest hover:underline transition-all">View all results for "{searchQuery}"</button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-auto lg:h-[280px] mt-4 relative z-10">
          
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden group border border-gray-100 h-[200px] lg:h-full shadow-sm bg-slate-50 flex items-center justify-center">
            {banners.length > 0 ? (
              <>
                <div className="flex h-full w-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {banners.map((banner, i) => (
                    <img 
                      key={banner.id || i} 
                      src={banner.imageUrl} 
                      onClick={() => handleBannerClick(banner.link)}
                      className={`w-full h-full object-fill shrink-0 ${banner.link ? 'cursor-pointer' : ''}`} 
                      alt={`Banner ${i}`} 
                    />
                  ))}
                </div>
                
                {banners.length > 1 && (
                  <>
                    <button type="button" onClick={() => setCurrentSlide(prev => (prev === 0 ? banners.length - 1 : prev - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-white">
                      <ChevronLeft size={18} />
                    </button>
                    <button type="button" onClick={() => setCurrentSlide(prev => (prev + 1) % banners.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-white">
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {banners.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${currentSlide === i ? "bg-white w-4" : "bg-white/50 w-1.5"}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active Banners</p>
                </div>
            )}
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-3 h-full">
            {categories.length > 0 ? categories.map((cat, i) => {
              const title = cat.name;
              const desc = cat.description || "Explore Now";
              const bgColor = cat.color || defaultColors[i % defaultColors.length];
              
              const imgUrl = cat.featuredImage || cat.image; 

              return (
                <div 
                  key={cat.id} 
                  onClick={() => router.push(`/search?q=${cat.slug}`)}
                  className={`${bgColor} relative rounded-2xl p-4 text-white overflow-hidden group cursor-pointer h-[150px] lg:h-full transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95`}
                >
                  <div className="relative z-10">
                    <h3 className="font-bold text-[13px] md:text-sm leading-tight uppercase tracking-tight">{title}</h3>
                    <p className="text-[10px] opacity-80 font-medium mt-0.5">{desc}</p>
                  </div>
                  {imgUrl && (
                    <img 
                      src={imgUrl} 
                      className="absolute bottom-0 right-0 w-[85%] h-[70%] object-contain object-right-bottom transition-transform duration-500 group-hover:scale-110" 
                      alt={title}
                    />
                  )}
                  <div className="absolute bottom-3 left-3 bg-white/20 p-1.5 rounded-md backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <ChevronRight size={14} />
                  </div>
                </div>
              );
            }) : (
                <div className="col-span-4 flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="text-center">
                       <Loader2 className="animate-spin mx-auto text-slate-300 mb-2" size={24} />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Sectors...</p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 flex justify-around items-center z-[60] md:hidden shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
        <NavItem icon={<HomeIcon size={22} />} label="Home" active onClick={() => router.push('/')} />
        <NavItem icon={<Briefcase size={22} />} label="B2B" onClick={() => router.push('/search?q=b2b')} />
        
        <div className="relative -top-6">
          <div className="bg-[#25d366] p-3.5 rounded-full shadow-2xl border-4 border-white active:scale-90 transition-transform flex items-center justify-center">
            <MessageCircle size={26} className="text-white" />
          </div>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Chat</span>
        </div>

        <NavItem icon={<Mail size={22} />} label="Leads" onClick={() => router.push('/dashboard')} />
        <NavItem icon={<User size={22} />} label="Account" onClick={() => router.push('/dashboard')} />
      </nav>
    </section>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${active ? "text-[#0073c1]" : "text-gray-400 hover:text-gray-600"}`}
    >
      {icon}
      <span className={`text-[9px] uppercase tracking-tighter ${active ? "font-black" : "font-bold"}`}>{label}</span>
    </div>
  );
}