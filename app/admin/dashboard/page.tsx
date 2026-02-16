// app/admin/dashboard/page.tsx

import React from "react";
import { db } from "@/lib/db"; 
import { 
  TrendingUp, Users, Store, MessageSquare, 
  ArrowUpRight, Calendar, ShieldCheck
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  
  const businessCount = await db.business.count();
  const userCount = await db.user.count();
  const leadCount = await db.enquiry.count();
  const pendingLeads = await db.enquiry.count({ where: { status: "PENDING" } });

  const recentLeads = await db.enquiry.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true } 
  });

  return (
    <div className="max-w-7xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Here is the real-time data from your database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Listings" 
          value={businessCount} 
          icon={<Store size={22} className="text-white" />} 
          color="bg-blue-600"
        />
        <StatCard 
          title="Registered Users" 
          value={userCount} 
          icon={<Users size={22} className="text-white" />} 
          color="bg-emerald-500"
        />
        <StatCard 
          title="Total Enquiries" 
          value={leadCount} 
          icon={<MessageSquare size={22} className="text-white" />} 
          color="bg-purple-500"
        />
        <StatCard 
          title="Pending Action" 
          value={pendingLeads} 
          icon={<ShieldCheck size={22} className="text-white" />} 
          color="bg-amber-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">Recent Enquiries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {lead.name || "Guest User"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{lead.mobile}</td>
                  <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">
                    {lead.message || "No message"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      lead.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No enquiries found yet.
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

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-3xl font-extrabold text-slate-800">{value}</h4>
      </div>
      <div className={`${color} p-4 rounded-xl shadow-lg shadow-black/5`}>
        {icon}
      </div>
    </div>
  );
}