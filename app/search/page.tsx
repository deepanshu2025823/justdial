// app/search/page.tsx

"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  MapPin, Phone, Star, 
  Filter, ChevronRight, Loader2, Store 
} from "lucide-react";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

function SearchResults() {
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get("q") || "";
  const catParam = searchParams.get("categoryId") || "";
  const cityParam = searchParams.get("city") || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bizRes, catRes] = await Promise.all([
          fetch(`/api/businesses/search?q=${query}&categoryId=${catParam}&city=${cityParam}`),
          fetch("/api/categories")
        ]);
        
        const bizData = await bizRes.json();
        const catData = await catRes.json();
        
        setBusinesses(bizData);
        setCategories(catData);
      } catch (err) {
        console.error("Search sync error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, catParam, cityParam]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 max-w-[1400px] mx-auto px-4 md:px-6 py-10 w-full">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <aside className="lg:w-72 shrink-0 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Filter size={16} className="text-[#0073c1]" /> Filter Results
              </h3>
              <div className="space-y-2">
                <Link 
                  href="/search"
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${!catParam ? 'bg-blue-50 text-[#0073c1]' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  All Sectors <ChevronRight size={14} />
                </Link>
                {categories.map((cat) => (
                  <Link 
                    key={cat.id}
                    href={`/search?categoryId=${cat.id}${query ? `&q=${query}` : ''}`}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${catParam === cat.id ? 'bg-blue-50 text-[#0073c1]' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {cat.name} <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-8 px-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {query ? `Results for "${query}"` : catParam ? "Category Listings" : "Local Directory"}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
                   {businesses.length} Verified Partners Online
                 </p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-inner">
                <Loader2 className="animate-spin text-[#0073c1] mb-4" size={48} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Syncing TiDB Records...</p>
              </div>
            ) : businesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businesses.map((biz) => (
                  <Link 
                    href={`/business/${biz.id}`} 
                    key={biz.id}
                    className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-100 transition-all group"
                  >
                    <div className="flex gap-6">
                      <div className="w-24 h-24 rounded-3xl bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-inner relative">
                        {biz.images?.[0] ? (
                          <img src={biz.images[0].url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><Store size={32} /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-black bg-blue-50 text-[#0073c1] px-2 py-1 rounded-md uppercase tracking-tighter mb-2 border border-blue-100">
                            {biz.category?.name || "Local Business"}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star size={12} fill="currentColor" />
                            <span className="text-xs font-black text-slate-900">4.5</span>
                          </div>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-tight mb-2 truncate">
                          {biz.name}
                        </h2>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          <MapPin size={12} className="text-red-500" /> {biz.city}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-tighter">
                        <Phone size={14} /> {biz.phone}
                      </div>
                      <div className="bg-[#0073c1] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                        Details
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200 shadow-inner">
                <Store size={48} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-500 font-black uppercase text-lg">No Results Found</p>
                <Link href="/search" className="text-[#0073c1] font-bold text-xs uppercase mt-4 inline-block hover:underline tracking-widest">Reset All Filters</Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0073c1]" size={40} />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}