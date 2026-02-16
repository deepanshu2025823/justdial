// app/admin/listings/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, Search, MapPin, Phone, Edit, Trash2, 
  CheckCircle, Loader2, Store, Globe, Filter, X, Clock
} from "lucide-react";

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    setLoading(true);
    const res = await fetch("/api/businesses");
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();
    
    setListings(Array.isArray(data) ? data : []); 
  } catch (error) {
    console.error("Failed to load listings");
    setListings([]); 
  } finally {
    setLoading(false);
  }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will permanently delete the business and its images.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/businesses?id=${id}`, { method: "DELETE" });
      if (res.ok) setListings(listings.filter(b => b.id !== id));
    } catch (error) {
      alert("Deletion failed");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/businesses?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isVerified: !currentStatus })
      });
      if (res.ok) {
        setListings(listings.map(b => b.id === id ? { ...b, isVerified: !currentStatus } : b));
      }
    } catch (error) {
      alert("Status update failed");
    }
  };

  const filteredListings = listings.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          biz.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "" || biz.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">BUSINESS INDEX</h1>
          <p className="text-sm text-slate-500 font-medium">Monitoring {listings.length} verified and pending listings.</p>
        </div>
        <Link 
          href="/admin/listings/create" 
          className="bg-[#0073c1] hover:bg-[#005a9c] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          <Plus size={20} /> Add New Listing
        </Link>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, city, or ID..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#0073c1] outline-none transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
            <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                    className="pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl appearance-none font-bold text-xs text-slate-700 outline-none focus:bg-white"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>
            { (searchTerm || selectedCategory) && (
                <button onClick={() => {setSearchTerm(""); setSelectedCategory("");}} className="p-3 text-red-500 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors">
                    <X size={20} />
                </button>
            )}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Detail</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#0073c1]" size={32} />
                    <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Querying TiDB Database...</p>
                  </td>
                </tr>
              ) : filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-tight">No Business Matches Found</p>
                  </td>
                </tr>
              ) : (
                filteredListings.map((biz) => (
                  <tr key={biz.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {biz.images?.[0]?.url ? (
                              <img src={biz.images[0].url} className="w-full h-full object-cover" alt="" />
                          ) : (
                              <span className="font-black text-[#0073c1] text-lg">{biz.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 tracking-tight">{biz.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">UID: {biz.id.slice(-10)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0073c1] text-[10px] font-black uppercase tracking-tighter border border-blue-100">
                        {biz.category?.name || "Other"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600 uppercase tracking-tight">
                        <div className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-300" /> {biz.city}</div>
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 leading-none"><Phone size={12} className="text-blue-400" /> {biz.phone}</div>
                            {biz.website && <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 lowercase italic leading-none"><Globe size={11} /> {biz.website.replace('https://','')}</div>}
                        </div>
                    </td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => toggleVerify(biz.id, biz.isVerified)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black transition-all border ${biz.isVerified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}
                      >
                        {biz.isVerified ? <><CheckCircle size={12} /> Verified</> : <><Clock size={12} /> Pending</>}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/listings/edit/${biz.id}`} className="p-2 text-slate-400 hover:text-[#0073c1] hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                          <Edit size={18} />
                        </Link>
                        <button 
                            disabled={deletingId === biz.id}
                            onClick={() => handleDelete(biz.id)} 
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          {deletingId === biz.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}