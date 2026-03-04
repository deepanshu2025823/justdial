// app/admin/services/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, Loader2, Upload, Edit, X, 
  Save, Link as LinkIcon, Type, Smartphone 
} from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [section, setSection] = useState("BILLS"); 
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error");
    } finally { setFetching(false); }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    
    if (!editId || link === "") {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      setLink(slug ? `/search?q=${slug}` : "");
    }
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Please upload an icon image.");
    setLoading(true);

    const method = editId ? "PATCH" : "POST";
    const url = editId ? `/api/services?id=${editId}` : "/api/services";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image, link, section, note }),
      });
      if (res.ok) {
        cancelEdit();
        fetchServices();
      } else {
        alert("Operation failed. Try smaller image.");
      }
    } finally { setLoading(false); }
  };

  const cancelEdit = () => {
    setEditId(null); setName(""); setImage(""); setLink(""); setNote("");
  };

  const startEdit = (s: any) => {
    setEditId(s.id);
    setName(s.name);
    setImage(s.image);
    setLink(s.link || "");
    setSection(s.section);
    setNote(s.note || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 font-sans">
      <div className="mb-10 px-4">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Micro Services</h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[3px] mt-2">Shortcuts & Gateway Management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <div className="lg:col-span-1">
          <div className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-500 shadow-2xl sticky top-24 ${editId ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100'}`}>
            <h2 className="text-xl font-black mb-8 uppercase flex items-center gap-2 text-slate-800">
              {editId ? <Edit size={22} className="text-blue-600"/> : <Smartphone size={22} className="text-[#0073c1]"/>}
              {editId ? "Update Link" : "Add Service"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button type="button" onClick={() => setSection("BILLS")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${section === "BILLS" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Bills</button>
                <button type="button" onClick={() => setSection("TRAVEL")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${section === "TRAVEL" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Travel</button>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Name</label>
                <input value={name} onChange={handleNameChange} placeholder="e.g. Mobile Recharge" className="w-full mt-2 p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" required />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Redirect / Target URL</label>
                <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="/search?q=..." className="w-full mt-2 p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none text-blue-600" />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtext (Note)</label>
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Powered By Easemytrip" className="w-full mt-2 p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none" />
              </div>

              <div className="border-2 border-dashed rounded-[2rem] p-8 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors group">
                {image ? (
                  <div className="relative inline-block animate-in zoom-in-95">
                    <img src={image} className="h-20 w-20 object-contain shadow-sm" alt="preview" />
                    <button type="button" onClick={() => setImage("")} className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-lg"><X size={12} strokeWidth={3}/></button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="mx-auto text-slate-300 group-hover:text-[#0073c1] transition-transform group-hover:-translate-y-1" size={36}/>
                    <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest leading-tight">Attach Service Icon</p>
                    <input type="file" accept="image/*" onChange={handleIconUpload} className="hidden" />
                  </label>
                )}
              </div>

              <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[4px] shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : editId ? "Authorize Update" : "Deploy Micro-Service"}
              </button>
              {editId && <button type="button" onClick={cancelEdit} className="w-full text-slate-400 font-black uppercase text-[9px] tracking-widest pt-2">Abandon Edit</button>}
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {["BILLS", "TRAVEL"].map((sec) => (
            <div key={sec} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center px-10">
                <span className="font-black text-[10px] uppercase tracking-[4px] text-slate-400">{sec} Network</span>
                <span className="bg-white px-3 py-1 rounded-full border text-[9px] font-black text-blue-500 uppercase">{services.filter(s => s.section === sec).length} Active</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-8">
                {services.filter(s => s.section === sec).map((s) => (
                  <div key={s.id} className="p-6 border-2 border-slate-50 rounded-[2rem] flex flex-col items-center group relative hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-slate-100 mb-4 transition-transform group-hover:scale-110">
                      <img src={s.image} className="h-10 w-10 object-contain" alt={s.name} />
                    </div>
                    <p className="text-[12px] font-black uppercase text-slate-700 text-center tracking-tighter">{s.name}</p>
                    <p className="text-[8px] text-blue-400 font-mono mt-1 truncate w-full text-center">{s.link}</p>
                    
                    <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(s)} className="p-2 bg-white text-blue-600 rounded-xl shadow-md hover:bg-blue-600 hover:text-white transition-colors"><Edit size={14}/></button>
                      <button onClick={async () => {if(confirm("Permanently delete this service?")) {await fetch(`/api/services?id=${s.id}`, {method:"DELETE"}); fetchServices();}}} className="p-2 bg-white text-red-600 rounded-xl shadow-md hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}