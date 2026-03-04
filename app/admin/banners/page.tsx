// app/admin/banners/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, Image as ImageIcon, Loader2, Search, 
  Upload, Edit, X, Save, Link as LinkIcon, Type, ToggleLeft, ToggleRight
} from "lucide-react";

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error");
    } finally {
      setFetching(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (!editId || link === "") {
        const generatedSlug = newTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') 
            .replace(/(^-|-$)+/g, '');   
        
        setLink(generatedSlug ? `/search?q=${generatedSlug}` : "");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert("Please upload a banner image.");
    setLoading(true);

    const method = editId ? "PATCH" : "POST";
    const url = editId ? `/api/banners?id=${editId}` : "/api/banners";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, imageUrl, link, isActive }),
      });

      if (res.ok) {
        cancelEdit();
        fetchBanners();
      } else {
        alert("Operation failed. Please try again.");
      }
    } catch (error) {
      alert("Database error.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (banner: any) => {
    setEditId(banner.id);
    setTitle(banner.title || "");
    setImageUrl(banner.imageUrl || "");
    setLink(banner.link || "");
    setIsActive(banner.isActive);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setImageUrl("");
    setLink("");
    setIsActive(true);
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/banners?id=${id}`, { method: "DELETE" });
      if (res.ok) setBanners(banners.filter(b => b.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredBanners = banners.filter(b => 
    (b.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="mb-8 px-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Banners</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Homepage Carousel Management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <div className="lg:col-span-1">
          <div className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-500 shadow-2xl shadow-slate-200/60 sticky top-24 ${editId ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100'}`}>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 uppercase tracking-tighter">
                  {editId ? <Edit size={22} className="text-blue-600" /> : <Plus size={22} className="text-[#0073c1]" />}
                  {editId ? "Edit Banner" : "New Banner"}
                </h2>
                {editId && (
                    <button onClick={cancelEdit} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                        <X size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-1.5"><Type size={12}/> Banner Title (Internal)</label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange} 
                  placeholder="e.g. Diwali Sale 2024"
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-[#0073c1] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-1.5"><LinkIcon size={12}/> Target URL / Link</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. /search?q=diwali-sale-2024"
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-[#0073c1] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <p className="text-sm font-black text-slate-800 uppercase">Banner Status</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {isActive ? "Visible on site" : "Hidden from site"}
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsActive(!isActive)}
                  className={`transition-colors ${isActive ? 'text-[#0073c1]' : 'text-slate-300'}`}
                >
                  {isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 mb-2 block">Upload Banner Graphic</label>
                
                <div className={`relative border-2 border-dashed rounded-[2rem] p-4 transition-all group text-center flex flex-col items-center justify-center min-h-[160px] ${imageUrl ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 hover:border-[#0073c1]'}`}>
                  {imageUrl ? (
                    <div className="relative inline-block w-full animate-in zoom-in-95">
                        <img src={imageUrl} className="w-full h-32 object-cover rounded-2xl shadow-md border border-slate-100" alt="preview" />
                        <button type="button" onClick={() => setImageUrl("")} className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all active:scale-90 z-10">
                            <X size={14} strokeWidth={4} />
                        </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block w-full py-6">
                      <Upload className="mx-auto text-slate-300 group-hover:text-[#0073c1] transition-all group-hover:-translate-y-1" size={40} />
                      <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">Click to attach banner</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <button
                disabled={loading}
                className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[3px] text-xs shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 ${editId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-[#0073c1] hover:bg-[#005a9c] shadow-blue-200'} text-white`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    editId ? <><Save size={18} /> Update Banner</> : <><Plus size={18} /> Publish Banner</>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div className="relative w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search banners..." 
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0073c1] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                    {filteredBanners.length} Records
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-[3px]">
                    <th className="px-8 py-6">Graphic Preview</th>
                    <th className="px-6 py-6">Details & Status</th>
                    <th className="px-8 py-6 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fetching ? (
                    <tr><td colSpan={3} className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-[#0073c1]" size={40} /></td></tr>
                  ) : filteredBanners.map((banner) => (
                    <tr key={banner.id} className={`group transition-all ${editId === banner.id ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'}`}>
                      <td className="px-8 py-6">
                        <div className="w-40 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group-hover:shadow-md transition-shadow bg-slate-100 flex items-center justify-center">
                            {banner.imageUrl ? (
                                <img src={banner.imageUrl} alt="banner" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={24} className="text-slate-300" />
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-6 align-middle">
                        <p className="font-black text-slate-800 text-sm uppercase tracking-tight">{banner.title || "Untitled Banner"}</p>
                        <p className="text-[10px] text-blue-500 font-bold mt-1 tracking-widest truncate max-w-[200px]">{banner.link || "No Link Provided"}</p>
                        <div className="mt-2 flex items-center gap-2">
                           <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${banner.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                              {banner.isActive ? 'Active' : 'Disabled'}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right align-middle">
                        <div className="flex justify-end gap-3 transition-all">
                            <button 
                                onClick={() => startEdit(banner)}
                                className={`p-3 rounded-2xl transition-all shadow-sm border ${editId === banner.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 hover:text-blue-600 border-slate-100 hover:border-blue-200'}`}
                            >
                                <Edit size={18} />
                            </button>
                            <button 
                                onClick={() => deleteBanner(banner.id)}
                                className="p-3 bg-white text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-200 rounded-2xl transition-all shadow-sm"
                            >
                            <Trash2 size={18} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!fetching && filteredBanners.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">No banners found. Create one.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}