// components/TopCategories.tsx

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Image as ImageIcon } from "lucide-react";

export default function TopCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const weddingItem = data.find(c => c.name.toLowerCase().includes("wedding"));
          const otherItems = data.filter(c => !c.name.toLowerCase().includes("wedding"));
          
          const reordered = [
            ...otherItems.slice(0, 4),
            weddingItem,
            ...otherItems.slice(4)
          ].filter(Boolean); 

          setCategories(reordered);
        }
      } catch (err) {
        console.error("Database fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-[#0073c1]" size={32} />
    </div>
  );

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-10 mt-5 font-sans">
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-y-10 gap-x-2">
        {categories.map((cat) => {
          const isSpecial = cat.name.toLowerCase().includes("wedding");

          return (
            <Link 
              key={cat.id} 
              href={`/search?categoryId=${cat.id}`}
              className="group flex flex-col items-center text-center cursor-pointer transition-transform duration-200 hover:-translate-y-1"
            >
              <div className={`
                relative w-[68px] h-[68px] mb-3 flex items-center justify-center rounded-2xl border border-gray-100 shadow-sm transition-all overflow-hidden
                group-hover:shadow-md group-hover:border-blue-100 
                ${isSpecial ? 'bg-[#ffebf3] border-none' : 'bg-white'}
              `}>
                
                {cat.image ? (
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className={`
                      ${isSpecial ? 'w-full h-full object-cover scale-110' : 'w-10 h-10 object-contain'}
                      transition-transform duration-300 group-hover:scale-110
                    `}
                  />
                ) : (
                  <div className={`flex items-center justify-center w-full h-full ${isSpecial ? 'bg-pink-100 text-pink-400' : 'bg-slate-50 text-slate-300'}`}>
                     <span className="text-[10px] font-black uppercase">{cat.name.substring(0,2)}</span>
                  </div>
                )}
                
                {isSpecial && (
                  <div className="absolute bottom-0 w-full bg-pink-500 text-[8px] text-white font-bold py-0.5 uppercase z-10 text-center">
                    Wedding
                  </div>
                )}
              </div>

              <p className="text-[13px] text-[#222] font-medium leading-tight px-1 max-w-[90px] group-hover:text-blue-600 transition-colors">
                {cat.name}
              </p>
            </Link>
          );
        })}

        <Link 
          href="/search"
          className="group flex flex-col items-center text-center cursor-pointer transition-transform duration-200 hover:-translate-y-1"
        >
          <div className="relative w-[68px] h-[68px] mb-3 flex items-center justify-center rounded-2xl border border-gray-100 shadow-sm bg-white group-hover:shadow-md group-hover:border-blue-100 overflow-hidden">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/8106/8106985.png" 
              alt="Popular Categories" 
              className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <p className="text-[13px] text-[#222] font-medium leading-tight px-1 max-w-[90px] group-hover:text-blue-600 transition-colors">
            Popular Categories
          </p>
        </Link>
      </div>
    </section>
  );
}