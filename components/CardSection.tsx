// components/CardSection.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CardSection() {
  const router = useRouter();
  const [sections, setSections] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Yeh wahi 4 sections hain jo aapne static mein banaye the aur ab Admin se control honge
  const targetSectionNames = [
    "Wedding Requisites",
    "Beauty & Spa",
    "Repairs & Services",
    "Daily Needs"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [secRes, serRes] = await Promise.all([
          fetch("/api/card-sections"), // Yeh API categories + businesses laati hai
          fetch("/api/services")       // Yeh API Micro-services laati hai
        ]);
        
        if (!secRes.ok || !serRes.ok) throw new Error("Sync failed");

        const secData = await secRes.json();
        const serData = await serRes.json();

        // Admin panel se aayi categories ko hamare target headers ke sath match karke organize karein
        const organized = targetSectionNames.map(name => 
           secData.find((cat: any) => cat.name.toLowerCase() === name.toLowerCase())
        ).filter(Boolean);

        setSections(organized);
        setServices(Array.isArray(serData) ? serData : []);
      } catch (err) {
        console.error("Card Section Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-[#0073c1]" size={40} />
    </div>
  );

  const billServices = services.filter(s => s.section === "BILLS");
  const travelServices = services.filter(s => s.section === "TRAVEL");

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-8 font-sans">
      
      {/* --- TOP GRID: 4 MAIN SECTIONS FROM ADMIN --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((category) => (
          <div 
            key={category.id} 
            className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[17px] font-bold text-gray-800 uppercase tracking-tight">
                {category.name}
              </h2>
              <span 
                onClick={() => router.push(`/search?categoryId=${category.id}`)}
                className="text-[12px] text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                View All
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Har category ke andar wahi 3 businesses dikhao jo Admin se add hue hain */}
              {category.businesses && category.businesses.length > 0 ? (
                category.businesses.slice(0, 3).map((biz: any) => (
                  <div 
                    key={biz.id} 
                    onClick={() => router.push(`/business/${biz.id}`)}
                    className="group cursor-pointer text-center"
                  >
                    <div className="relative aspect-[4/3] mb-3 overflow-hidden rounded-lg bg-gray-100 border border-slate-100">
                      {/* Admin se uploaded business image use karein */}
                      <img
                        src={biz.image || "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/banquethalls_rectangle_2024.webp"}
                        alt={biz.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <p className="text-[13px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors leading-tight truncate">
                      {biz.name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-300 uppercase">Add items to "{category.name}" in Admin</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- BOTTOM SECTIONS: BILLS & TRAVEL --- */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm mt-10 bg-white">
        
        {/* Dynamic Bills Section */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10">
            <div className="lg:w-1/4">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-[22px] font-extrabold text-gray-900">Bills & Recharge</h2>
                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bharat_billpay_Newlogo.svg" alt="icon" className="h-6" />
              </div>
              <p className="text-[14px] text-gray-500 mb-4 leading-snug">Pay your bills & recharge instantly with Justdial</p>
              <button className="text-[#0073c1] font-bold text-[14px] hover:underline">Explore More</button>
            </div>

            <div className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-6">
              {billServices.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => router.push(item.link || "#")}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-[72px] h-[72px] flex items-center justify-center border border-gray-100 rounded-2xl mb-3 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1 bg-white p-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-800 mb-1 text-center">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Travel Section */}
        <div className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10">
            <div className="lg:w-1/4">
              <h2 className="text-[22px] font-extrabold text-gray-900 mb-2">Travel Bookings</h2>
              <p className="text-[14px] text-gray-500 mb-4 leading-snug">Instant ticket bookings for your best travel experience</p>
              <button className="text-[#0073c1] font-bold text-[14px] hover:underline">Explore More</button>
            </div>

            <div className="flex-1 grid grid-cols-3 sm:grid-cols-5 gap-6">
              {travelServices.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => router.push(item.link || "#")}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-[72px] h-[72px] flex items-center justify-center border border-gray-100 rounded-2xl mb-3 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1 bg-white p-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-800 mb-1 text-center">{item.name}</span>
                  {item.note && (
                    <span className={`${item.noteColor || 'text-green-600'} text-[10px] font-medium text-center leading-tight`}>
                      {item.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}