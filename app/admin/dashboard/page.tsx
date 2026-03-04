"use client";

import React, { useEffect, useState, useCallback } from "react";
import NextLink from "next/link"; 
import { 
  Users, Store, MessageSquare, Layers, 
  TrendingUp, ArrowUpRight, Activity, Loader2, Globe, Cpu,
  Calendar, AlertCircle
} from "lucide-react";

interface DashboardStats {
  listings: number;
  users: number;
  leads: number;
  activeSectors: number;
}

interface CategoryDist {
  name: string;
  count: number;
}

interface RecentLead {
  id: string;
  name: string;
  mobile: string;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
  business?: { name: string };
}

interface DashboardData {
  stats: DashboardStats;
  categoryDistribution: CategoryDist[];
  recentLeads: RecentLead[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsRes, leadsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/leads")
      ]);

      if (!analyticsRes.ok || !leadsRes.ok) throw new Error("Sync Failed");

      const analyticsJson = await analyticsRes.json();
      const leadsJson = await leadsRes.json();
      
      setData({ 
        ...analyticsJson, 
        recentLeads: Array.isArray(leadsJson) ? leadsJson.slice(0, 5) : [] 
      });
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
      setError("Database connection timed out. Retrying...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center flex-col gap-4 bg-[#fcfdfe]">
      <div className="relative">
        <Loader2 className="animate-spin text-[#0073c1] relative z-10" size={56} />
        <div className="absolute inset-0 blur-xl bg-blue-200/50 animate-pulse" />
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[6px] animate-pulse">Syncing TiDB Cloud...</p>
    </div>
  );

  if (error) return (
    <div className="flex h-[70vh] items-center justify-center flex-col gap-4">
       <AlertCircle className="text-red-500" size={48} />
       <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">{error}</p>
       <button onClick={fetchAnalytics} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">Retry Sync</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Infrastructure <span className="text-[#0073c1]">Live</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[3px] flex items-center gap-2">
               TiDB Cluster Operational
            </p>
          </div>
        </div>
        
        <div className="w-full lg:w-auto bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between lg:justify-start gap-8">
            <div className="text-left lg:text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Node Region</p>
                <p className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2 lg:justify-end">
                   <Globe size={14} className="text-blue-500" /> ap-southeast-1
                </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-inner">
                <Cpu size={24} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Listings" value={data?.stats?.listings} icon={<Store size={22} />} color="blue" />
        <StatCard title="Registered Users" value={data?.stats?.users} icon={<Users size={22} />} color="indigo" />
        <StatCard title="Total Enquiries" value={data?.stats?.leads} icon={<MessageSquare size={22} />} color="emerald" />
        <StatCard title="Active Sectors" value={data?.stats?.activeSectors} icon={<Layers size={22} />} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                <TrendingUp size={24} className="text-[#0073c1]" /> Sector Penetration
            </h2>
            <div className="px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
               <span className="text-[10px] font-black text-[#0073c1] uppercase tracking-widest">Real-time Distribution</span>
            </div>
          </div>
          
          <div className="space-y-10">
            {data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
              data.categoryDistribution.map((cat, i) => (
                <div key={i} className="group">
                    <div className="flex justify-between items-end mb-3">
                        <p className="text-xs font-black text-slate-600 uppercase tracking-[2px] group-hover:text-blue-600 transition-colors">{cat.name}</p>
                        <p className="text-xs font-bold text-slate-400">{cat.count} Units</p>
                    </div>
                    <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-400 via-[#0073c1] to-blue-800 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${Math.min((cat.count / (data?.stats?.listings || 1)) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            ))) : (
              <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
                <p className="text-slate-300 font-black uppercase text-[10px] tracking-[5px]">Waiting for data stream...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Activity size={120} />
            </div>
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[4px] mb-8">System Audit</h3>
            <div className="space-y-6 relative z-10">
                <AuditRow label="Prisma Client" value="v6.2.1" dark />
                <AuditRow label="ORM Engine" value="Library" dark />
                <AuditRow label="DB Latency" value="12ms" dark />
                <AuditRow label="SSL Status" value="Encrypted" dark />
            </div>
            
            <div className="mt-12 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                <p className="text-[9px] font-black uppercase tracking-[3px] text-blue-300 mb-2 text-center">Cloud Health</p>
                <div className="flex items-center justify-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                   <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">100% Operational</p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50 overflow-hidden">
        <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
            <div>
              <h3 className="font-black text-slate-800 uppercase tracking-tighter text-xl flex items-center gap-3">
                <Calendar size={24} className="text-blue-500" /> Recent Inbound Leads
              </h3>
            </div>
            <NextLink href="/admin/leads" className="group flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-6 py-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-all">
              View Database <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NextLink>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[3px]">
                <th className="px-10 py-8">Customer Detail</th>
                <th className="px-6 py-8">Business Target</th>
                <th className="px-6 py-8">Status</th>
                <th className="px-10 py-8 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.recentLeads && data.recentLeads.length > 0 ? data.recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-10 py-6">
                    <p className="font-black text-slate-800 text-sm uppercase tracking-tight">{lead.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{lead.mobile}</p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-blue-400" />
                       <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{lead.business?.name || 'Unmapped'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${
                      lead.status === "PENDING" 
                      ? "bg-amber-50 text-amber-600 border-amber-100" 
                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <p className="font-black text-slate-300 uppercase tracking-[8px] text-xs">No Recent Enquiries</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value?: number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/10",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-500/10",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/10",
    orange: "bg-orange-50 text-orange-600 border-orange-100 shadow-orange-500/10"
  };
  
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border-2 ${colors[color]} group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-2">{title}</p>
      <div className="flex items-center justify-between">
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value?.toLocaleString() || 0}</h3>
        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
           <ArrowUpRight size={18} />
        </div>
      </div>
    </div>
  );
}

function AuditRow({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className={`flex justify-between items-center pb-4 border-b ${dark ? 'border-white/5' : 'border-slate-50'} last:border-0 last:pb-0`}>
      <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-blue-200/50' : 'text-slate-400'}`}>{label}</span>
      <span className={`text-xs font-bold uppercase ${dark ? 'text-white' : 'text-slate-800'}`}>{value}</span>
    </div>
  );
}