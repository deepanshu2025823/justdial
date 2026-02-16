// app/admin/leads/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { 
  Search, Trash2, Mail, Phone, MessageSquare, 
  CheckCircle, Loader2, Filter, X, Clock, ExternalLink, User, Store
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Remove this enquiry from records?")) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) setLeads(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.mobile.includes(searchTerm);
    const matchesStatus = filterStatus === "ALL" || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Inbound Leads</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">
            Total Traffic: {leads.length} Enquiries
          </p>
        </div>
        <button onClick={fetchLeads} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95">
          <Clock size={18} /> Refresh Feed
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by lead name or mobile..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-sm text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
                <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl appearance-none font-black text-[12px] uppercase text-slate-700 outline-none focus:bg-white transition-all cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">All Enquiries</option>
                    <option value="PENDING">Pending Only</option>
                    <option value="RESOLVED">Resolved Only</option>
                </select>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[3px]">
                <th className="px-10 py-8">Lead Information</th>
                <th className="px-6 py-8">Interested In</th>
                <th className="px-6 py-8">Requirement</th>
                <th className="px-6 py-8">Status</th>
                <th className="px-10 py-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-40 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#0073c1] mb-4" size={48} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Accessing Inbound Feed</p>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-40 text-center">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="text-slate-300" size={40} />
                    </div>
                    <p className="text-slate-500 font-black uppercase tracking-tight text-lg">No Recent Enquiries</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-blue-50/40 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                           <User className="text-slate-400" size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg tracking-tight leading-tight">{lead.name}</p>
                          <div className="flex items-center gap-3 mt-1.5 font-bold text-[11px] text-slate-400">
                             <div className="flex items-center gap-1 text-emerald-600"><Phone size={12} /> {lead.mobile}</div>
                             <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                             <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2">
                        <Store className="text-blue-500" size={16} />
                        <p className="font-black text-slate-700 text-xs uppercase tracking-tight truncate max-w-[150px]">
                          {lead.business?.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                       <p className="text-xs font-medium text-slate-500 leading-relaxed italic line-clamp-2 max-w-[200px]">
                        "{lead.message || "No specific message provided."}"
                       </p>
                    </td>
                    <td className="px-6 py-8">
                      <select 
                        disabled={processingId === lead.id}
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border transition-all cursor-pointer outline-none shadow-sm
                          ${lead.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}
                        `}
                      >
                        <option value="PENDING">● Pending</option>
                        <option value="RESOLVED">● Resolved</option>
                      </select>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                            onClick={() => deleteLead(lead.id)} 
                            className="p-3 text-slate-400 hover:text-red-600 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={20} />
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