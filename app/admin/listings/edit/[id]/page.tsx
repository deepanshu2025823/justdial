// app/admin/listing/edit/[id]/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, Save, Loader2, Store, MapPin, 
  Phone, Globe, Image as ImageIcon, Layers, Sparkles, Trash2, 
  Link as LinkIcon, Mail, FileText
} from "lucide-react";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; 
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(true);

  const [imageMode, setImageMode] = useState<"url" | "ai">("url");
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    pincode: "",
    description: "",
    image: "" 
  });

  useEffect(() => {
    const initData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [catRes, bizRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/businesses/${id}`) 
        ]);

        if (!bizRes.ok) throw new Error("Listing not found");

        const cats = await catRes.json();
        const biz = await bizRes.json();

        setCategories(cats);
        setFormData({
          name: biz.name || "",
          categoryId: biz.categoryId || "",
          phone: biz.phone || "",
          email: biz.email || "",
          website: biz.website || "",
          address: biz.address || "",
          city: biz.city || "",
          pincode: biz.pincode || "",
          description: biz.description || "",
          image: biz.images?.[0]?.url || "" 
        });
      } catch (error) {
        console.error("Initialization failed:", error);
        alert("Error: Listing data could not be retrieved from TiDB.");
        router.push("/admin/listings");
      } finally {
        setLoading(false);
        setFetchingCats(false);
      }
    };
    initData();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) {
        alert("Please enter a prompt description");
        return;
    }
    setGenerating(true);
    try {
        const res = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: aiPrompt })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setFormData({ ...formData, image: data.url }); 
    } catch (error) {
        alert("AI Service busy. Please try again.");
    } finally {
        setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`/api/businesses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/listings"); 
      } else {
        alert("Failed to sync updates to database.");
      }
    } catch (error) {
      alert("Network error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col h-[70vh] items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-[#0073c1]" size={48} />
      <p className="text-xs font-black text-slate-400 uppercase tracking-[4px]">Fetching TiDB Records...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 font-sans">
      
      <div className="flex items-center gap-4 mb-8 px-2">
        <Link 
          href="/admin/listings" 
          className="bg-white p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Modify Listing</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 font-mono">UID: {id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tighter">
              <Store size={22} className="text-blue-600" /> Basic Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name <span className="text-red-500">*</span></label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry Type <span className="text-red-500">*</span></label>
                <div className="relative mt-2">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Public Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tighter">
              <Phone size={22} className="text-emerald-500" /> Communication details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" />
              </div>
              <div className="md:col-span-2 relative space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="website" value={formData.website} onChange={handleChange} className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none" />
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: LOCATION & MEDIA --- */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
              <MapPin size={22} className="text-red-500" /> Physical
            </h2>
            <div className="space-y-4">
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" required />
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" />
              <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Zip Code" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
              <ImageIcon size={22} className="text-purple-600" /> Media Hub
            </h2>
            
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
                <button type="button" onClick={() => setImageMode("url")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${imageMode === "url" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Link</button>
                <button type="button" onClick={() => setImageMode("ai")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${imageMode === "ai" ? "bg-white text-purple-600 shadow-sm" : "text-slate-500"}`}>AI</button>
            </div>

            {imageMode === "url" ? (
                <input name="image" value={formData.image} onChange={handleChange} placeholder="Remote Image URL" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" />
            ) : (
                <div className="flex gap-2">
                    <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="AI Prompt..." className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white transition-all" />
                    <button type="button" onClick={handleGenerateImage} disabled={generating} className="bg-purple-600 text-white p-4 rounded-2xl hover:scale-95 transition-all shadow-lg shadow-purple-200 active:scale-90">
                        {generating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    </button>
                </div>
            )}
            
            {formData.image && (
              <div className="mt-6 relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border-4 border-white ring-1 ring-slate-100">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                      <button type="button" onClick={() => setFormData({ ...formData, image: "" })} className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all"><Trash2 size={24} /></button>
                  </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={updating}
            className="w-full bg-[#0073c1] text-white py-5 rounded-[2rem] font-black uppercase tracking-[3px] shadow-2xl shadow-blue-500/30 transition-all hover:bg-[#005a9c] hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {updating ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Sync Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}