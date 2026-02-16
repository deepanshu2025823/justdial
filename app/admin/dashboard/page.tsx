// app/admin/dashboard/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import NextLink from "next/link"; 
import { 
  Users, Store, MessageSquare, Layers, 
  TrendingUp, ArrowUpRight, Activity, Loader2, Globe, Cpu,
  Calendar, CheckCircle, Clock
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsRes, leadsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/leads")
      ]);

      if (!analyticsRes.ok || !leadsRes.ok) throw new Error("Database Sync Failed");

      const analyticsJson = await analyticsRes.json();
      const leadsJson = await leadsRes.json();
      
      setData({ 
        ...analyticsJson, 
        recentLeads: Array.isArray(leadsJson) ? leadsJson.slice(0, 5) : [] 
      });
    } catch (err) {
      console.error("Analytics sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center flex-col gap-4">
      <Loader2 className="animate-spin text-[#0073c1]" size={48} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Syncing TiDB Records...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" /> Live TiDB Analytics
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Server Location</p>
                <p className="text-sm font-bold text-slate-800 uppercase">ap-southeast-1</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0073c1]">
                <Cpu size={20} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Listings" value={data?.stats?.listings} icon={<Store size={22} />} color="blue" />
        <StatCard title="Registered Users" value={data?.stats?.users} icon={<Users size={22} />} color="indigo" />
        <StatCard title="Total Enquiries" value={data?.stats?.leads} icon={<MessageSquare size={22} />} color="emerald" />
        <StatCard title="Active Sectors" value={data?.stats?.activeSectors} icon={<Layers size={22} />} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" /> Sector Penetration
            </h2>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">DB Distribution</span>
          </div>
          
          <div className="space-y-8 min-h-[200px]">
            {data?.categoryDistribution?.length > 0 ? data.categoryDistribution.map((cat: any, i: number) => (
                <div key={i}>
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{cat.name}</p>
                        <p className="text-xs font-bold text-slate-400">{cat.count} items</p>
                    </div>
                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-[#0073c1] transition-all duration-1000" 
                            style={{ width: `${Math.min((cat.count / (data?.stats?.listings || 1)) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            )) : (
              <p className="text-center text-slate-400 font-bold uppercase text-[10px] tracking-[4px] pt-12">No Sector Data Syncing</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Database Audit</h3>
            <div className="space-y-4 font-mono">
                <AuditRow label="Prisma Client" value="v6.x" />
                <AuditRow label="Provider" value="MySQL (TiDB)" />
                <AuditRow label="Latency" value="18ms" />
            </div>
            <div className="mt-8 bg-[#0f172a] p-6 rounded-3xl text-white relative overflow-hidden">
                <Globe className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                <p className="text-xs font-bold text-emerald-400">100% OPERATIONAL</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" /> Recent Inbound Leads
            </h3>
            <NextLink href="/admin/leads" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All Leads</NextLink>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[3px]">
                <th className="px-10 py-6">Customer</th>
                <th className="px-6 py-6">Listing Target</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-10 py-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.recentLeads?.length > 0 ? data.recentLeads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-blue-50/40 transition-all group">
                  <td className="px-10 py-6">
                    <p className="font-black text-slate-800 text-sm uppercase tracking-tight">{lead.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{lead.mobile}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold text-slate-600 uppercase">{lead.business?.name || 'Unmapped'}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      lead.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center font-black text-slate-300 uppercase tracking-widest text-xs">No Recent Enquiries Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-50",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50",
    orange: "bg-orange-50 text-orange-600 border-orange-100 shadow-orange-50"
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl hover:-translate-y-1 transition-all group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${colors[color]} group-hover:scale-110 transition-transform shadow-sm`}>
        {React.cloneElement(icon, { className: "shrink-0" })}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value || 0}</h3>
        <ArrowUpRight size={16} className="text-emerald-500 mb-1" />
      </div>
    </div>
  );
}

function AuditRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
      <span className="text-xs font-bold text-slate-800 uppercase">{value}</span>
    </div>
  );
}