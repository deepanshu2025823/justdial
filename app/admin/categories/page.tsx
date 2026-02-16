// app/admin/categories/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, Image as ImageIcon, Loader2, Search, 
  Upload, Edit, X, Save, Sparkles, Wand2 
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error");
    } finally {
      setFetching(false);
    }
  };

  const generateAIIcon = async () => {
    if (!name.trim()) {
      alert("Please enter a category name first (e.g., 'Luxury Spa')");
      return;
    }
    
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `A professional, minimalist high-quality square icon for a "${name}" business category, modern style, clean background, 4k resolution` 
        })
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImage(data.url);
      } else {
        throw new Error("Generation failed");
      }
    } catch (error) {
      alert("AI Service busy. Please try manual upload.");
    } finally {
      setGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = editId ? "PATCH" : "POST";
    const url = editId ? `/api/categories?id=${editId}` : "/api/categories";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      if (res.ok) {
        cancelEdit();
        fetchCategories();
      } else {
        alert("Operation failed. Possible duplicate name.");
      }
    } catch (error) {
      alert("Database error.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (cat: any) => {
    setEditId(cat.id);
    setName(cat.name);
    setImage(cat.image || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setName("");
    setImage("");
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This affects listings in this category.")) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="mb-8 px-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Categories</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Directory Structure Management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <div className="lg:col-span-1">
          <div className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-500 shadow-2xl shadow-slate-200/60 sticky top-24 ${editId ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100'}`}>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 uppercase tracking-tighter">
                  {editId ? <Edit size={22} className="text-blue-600" /> : <Plus size={22} className="text-[#0073c1]" />}
                  {editId ? "Update Info" : "New Sector"}
                </h2>
                {editId && (
                    <button onClick={cancelEdit} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                        <X size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Label Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Restaurants"
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-[#0073c1] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Visual Icon</label>
                  <button 
                    type="button"
                    onClick={generateAIIcon}
                    disabled={generating || !name}
                    className="flex items-center gap-1.5 text-[10px] font-black text-purple-600 uppercase tracking-tighter hover:text-purple-700 disabled:opacity-30 transition-all"
                  >
                    {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    AI Generate
                  </button>
                </div>
                
                <div className={`relative border-2 border-dashed rounded-[2rem] p-8 transition-all group text-center flex flex-col items-center justify-center min-h-[200px] ${image ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 hover:border-[#0073c1]'}`}>
                  {generating ? (
                    <div className="animate-pulse flex flex-col items-center">
                        <Wand2 size={40} className="text-purple-400 animate-bounce" />
                        <p className="text-[10px] font-black text-purple-500 uppercase mt-4 tracking-widest">AI is painting...</p>
                    </div>
                  ) : image ? (
                    <div className="relative inline-block animate-in zoom-in-95">
                        <img src={image} className="h-32 w-32 object-cover rounded-[1.5rem] shadow-2xl ring-4 ring-white" alt="preview" />
                        <button type="button" onClick={() => setImage("")} className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all active:scale-90">
                            <X size={14} strokeWidth={4} />
                        </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block w-full py-4">
                      <Upload className="mx-auto text-slate-300 group-hover:text-[#0073c1] transition-all group-hover:-translate-y-1" size={40} />
                      <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">Click to upload file</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <button
                disabled={loading || generating}
                className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[3px] text-xs shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 ${editId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-[#0073c1] hover:bg-[#005a9c] shadow-blue-200'} text-white`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    editId ? <><Save size={18} /> Update Category</> : <><Plus size={18} /> Publish Sector</>
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
                        placeholder="Search sectors..." 
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0073c1] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                    {filteredCategories.length} Active Items
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-[3px]">
                    <th className="px-10 py-6">Visual Ident</th>
                    <th className="px-6 py-6">System Slug</th>
                    <th className="px-10 py-6 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fetching ? (
                    <tr><td colSpan={3} className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-[#0073c1]" size={40} /></td></tr>
                  ) : filteredCategories.map((cat) => (
                    <tr key={cat.id} className={`group transition-all ${editId === cat.id ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'}`}>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-slate-100 shadow-lg transition-transform group-hover:scale-110 shrink-0">
                            {cat.image ? (
                                <img src={cat.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <ImageIcon size={24} className="text-slate-200" />
                            )}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-lg uppercase tracking-tighter leading-none">{cat.name}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Ref: {cat.id.slice(-6)}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[11px] font-black text-[#0073c1]/60 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 uppercase tracking-tighter">/{cat.slug}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3 transition-all">
                            <button 
                                onClick={() => startEdit(cat)}
                                className={`p-3 rounded-2xl transition-all shadow-sm border ${editId === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 hover:text-blue-600 border-slate-100 hover:border-blue-200'}`}
                            >
                                <Edit size={18} />
                            </button>
                            <button 
                                onClick={() => deleteCategory(cat.id)}
                                className="p-3 bg-white text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-200 rounded-2xl transition-all shadow-sm"
                            >
                            <Trash2 size={18} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!fetching && filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">No records matching search query</td>
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