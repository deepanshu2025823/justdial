// app/admin/listings/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, Search, MapPin, Phone, 
  MoreHorizontal, Edit, Trash2, CheckCircle 
} from "lucide-react";

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/businesses");
      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Business Listings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all registered businesses and services.</p>
        </div>
        <Link 
          href="/admin/listings/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Add New Business
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by business name, city..." 
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">All Categories</option>
          <option value="restaurants">Restaurants</option>
          <option value="doctors">Doctors</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Business Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading listings...</td>
                </tr>
              ) : filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-slate-50 p-4 rounded-full mb-3">
                        <MapPin size={24} className="text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium">No businesses found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your search or add a new listing.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredListings.map((biz) => (
                  <tr key={biz.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg">
                          {biz.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{biz.name}</p>
                          <p className="text-[11px] text-slate-400">ID: {biz.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                        {biz.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <MapPin size={14} className="text-slate-400" />
                        {biz.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <Phone size={14} className="text-slate-400" />
                        {biz.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {biz.isVerified ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-md w-fit">
                          <CheckCircle size={12} /> Verified
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
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