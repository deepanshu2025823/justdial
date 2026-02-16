// app/admin/reviews/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { 
  Star, Trash2, User, Store, MessageCircle, 
  Loader2, Search, Filter, AlertCircle, Clock 
} from "lucide-react";

export default function ReviewsModerationPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to sync reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this review permanently? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) setReviews(prev => prev.filter(r => r.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = reviews.filter(rev => 
    rev.business?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Moderation Room</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">
            Total Feedback: {reviews.length} Entries
          </p>
        </div>
        <button onClick={fetchReviews} className="bg-[#0073c1] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-[2px] text-xs shadow-xl active:scale-95 transition-all">
          Refresh Content
        </button>
      </div>

      <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by business, user, or keyword..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-sm text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[3px]">
                <th className="px-10 py-8">Author & Rating</th>
                <th className="px-6 py-8">Target Listing</th>
                <th className="px-6 py-8">Comment Content</th>
                <th className="px-6 py-8 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-40 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#0073c1] mb-4" size={48} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Syncing Content Stream</p>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-40 text-center">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                        <MessageCircle className="text-slate-300" size={40} />
                    </div>
                    <p className="text-slate-500 font-black uppercase tracking-tight text-lg">No Content to Moderate</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-blue-50/40 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 border border-white shadow-sm">
                           <User className="text-slate-400" size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg tracking-tight leading-tight">{rev.user?.name || "Anonymous"}</p>
                          <div className="flex items-center gap-1 mt-1">
                             {[...Array(5)].map((_, i) => (
                               <Star 
                                 key={i} 
                                 size={12} 
                                 fill={i < rev.rating ? "#f59e0b" : "none"} 
                                 className={i < rev.rating ? "text-amber-500" : "text-slate-200"} 
                               />
                             ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2">
                        <Store className="text-blue-500" size={16} />
                        <p className="font-black text-slate-700 text-xs uppercase tracking-tight truncate max-w-[150px]">
                          {rev.business?.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                       <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[300px]">
                        {rev.comment || <span className="italic text-slate-300 underline underline-offset-4 decoration-dotted">Rating only provided.</span>}
                       </p>
                       <div className="flex items-center gap-1.5 mt-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                         <Clock size={10} /> {new Date(rev.createdAt).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        disabled={deletingId === rev.id}
                        onClick={() => handleDelete(rev.id)} 
                        className="p-3.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-red-100 active:scale-90"
                        title="Delete Review"
                      >
                        {deletingId === rev.id ? <Loader2 size={20} className="animate-spin text-red-500" /> : <Trash2 size={20} />}
                      </button>
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