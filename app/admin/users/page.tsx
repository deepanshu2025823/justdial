// app/admin/users/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { 
  Search, Trash2, Mail, Phone, Shield, 
  User as UserIcon, Loader2, Plus, X, Edit, Save, 
  CheckCircle, ShieldAlert, Calendar, Fingerprint
} from "lucide-react";

export default function UsersCRUDPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", role: "USER"
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) { 
        console.error("Cloud Sync Error"); 
    } finally { 
        setLoading(false); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const method = selectedUser ? "PATCH" : "POST";
    const url = selectedUser ? `/api/admin/users?id=${selectedUser.id}` : "/api/admin/users";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
        resetForm();
      } else {
          alert("Error: Duplicate email or validation failed.");
      }
    } catch (err) { 
        alert("Network Error"); 
    } finally { 
        setSubmitting(false); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("CRITICAL: Deleting this user will also remove all their associated enquiries and reviews in TiDB. Proceed?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if(res.ok) setUsers(users.filter(u => u.id !== id));
    } catch (err) { 
        alert("Database lock prevent deletion."); 
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setFormData({ 
        name: user.name || "", 
        email: user.email, 
        phone: user.phone || "", 
        password: user.password, 
        role: user.role 
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({ name: "", email: "", phone: "", password: "", role: "USER" });
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500 font-sans">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">User Control</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[3px] mt-2 flex items-center gap-2">
             <Fingerprint size={14} className="text-blue-500"/> {users.length} Database Identities Found
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Filter by name, email or UID..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-[#0073c1] text-white px-6 py-4 rounded-[1.5rem] hover:bg-[#005a9c] transition-all shadow-xl shadow-blue-200 flex items-center gap-3 font-black uppercase tracking-widest text-xs active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Member Identity</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Access Role</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Connectivity</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px] text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-40 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#0073c1] mb-4" size={48} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Syncing TiDB Records</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan={4} className="py-32 text-center font-bold text-slate-300 uppercase tracking-widest">No matching records in index</td>
                </tr>
              ) : (
               filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white ring-4 ring-transparent group-hover:ring-blue-50 transition-all ${user.role === "ADMIN" ? "bg-gradient-to-tr from-blue-600 to-indigo-700" : "bg-gradient-to-tr from-slate-400 to-slate-500"}`}>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-lg tracking-tight leading-none uppercase">{user.name || "Anonymous"}</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest flex items-center gap-1.5">
                           <Calendar size={10} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${user.role === "ADMIN" ? "bg-blue-50 text-blue-700 border-blue-100 shadow-sm" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                      {user.role === "ADMIN" ? <Shield size={12} strokeWidth={3}/> : <UserIcon size={12} strokeWidth={3}/>} {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                        <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500"><Mail size={14} /></div>
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                           <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500"><Phone size={14} /></div>
                           {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(user)} 
                        className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-2xl transition-all shadow-sm border border-slate-100 hover:border-blue-100 active:scale-90"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)} 
                        className="p-3 bg-white text-slate-400 hover:text-red-600 rounded-2xl transition-all shadow-sm border border-slate-100 hover:border-red-100 active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{selectedUser ? "Modify Identity" : "Register New"}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Direct TiDB Synchronization</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all border border-slate-200 shadow-sm active:scale-90"><X size={22}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <ModalInput label="Full Name" value={formData.name} onChange={(v: string)=>setFormData({...formData, name: v})} placeholder="Deepanshu Joshi" />
                 <ModalInput label="Access Level" type="select" options={["USER", "ADMIN"]} value={formData.role} onChange={(v: string)=>setFormData({...formData, role: v})} />
              </div>
              
              <ModalInput label="Email Address (Unique)" type="email" value={formData.email} onChange={(v: string)=>setFormData({...formData, email: v})} placeholder="admin@justdial.com" />
              <div className="grid grid-cols-2 gap-6">
                 <ModalInput label="Phone Number" value={formData.phone} onChange={(v: string)=>setFormData({...formData, phone: v})} placeholder="+91 00000 00000" />
                 <ModalInput label="Security Key" type="password" value={formData.password} onChange={(v: string)=>setFormData({...formData, password: v})} placeholder="••••••••" />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-[#0073c1] text-white py-5 rounded-[2rem] font-black uppercase tracking-[3px] shadow-2xl shadow-blue-500/30 transition-all hover:bg-[#005a9c] hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Commit to Database</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


function ModalInput({ label, value, onChange, type="text", placeholder, options }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">{label}</label>
      {type === "select" ? (
         <div className="relative">
            <select 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              {options.map((opt: string) => <option key={opt} value={opt}>{opt} PRIVILEGE</option>)}
            </select>
            <Shield className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
         </div>
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={(e)=>onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner placeholder:text-slate-300"
          required
        />
      )}
    </div>
  );
}