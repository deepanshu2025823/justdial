// components/TrendingBusinesses.tsx

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, ChevronRight, Loader2, Store } from "lucide-react";

export default function TrendingBusinesses() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/businesses/trending")
      .then((res) => res.json())
      .then((data) => {
        setBusinesses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-[1300px] mx-auto px-4 py-10 flex justify-center">
      <Loader2 className="animate-spin text-[#0073c1]" size={32} />
    </div>
  );

  if (businesses.length === 0) return null;

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-16 font-sans">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Trending Near You
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px] mt-3">
            Top Rated & Verified Local Experts
          </p>
        </div>
        <Link href="/search" className="group flex items-center gap-2 text-[#0073c1] font-black text-[11px] uppercase tracking-widest hover:underline">
          Explore All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {businesses.map((biz) => (
          <Link 
            key={biz.id} 
            href={`/business/${biz.id}`}
            className="group bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:border-blue-100"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              {biz.images?.[0] ? (
                <img 
                  src={biz.images[0].url} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={biz.name} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Store size={48} strokeWidth={1} />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                  {biz.category?.name}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-black text-slate-900">{biz.rating || "4.5"}</span>
              </div>
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tighter leading-tight truncate">
                {biz.name}
              </h3>
              <p className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
                <MapPin size={12} className="text-red-500" /> {biz.city}
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Enquire Now</span>
                <ChevronRight size={16} className="text-blue-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}