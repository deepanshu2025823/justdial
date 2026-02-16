// app/admin/listings/create/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, Save, Loader2, Store, MapPin, 
  Phone, Globe, Image as ImageIcon, Layers, Sparkles, Trash2, Link as LinkIcon,
  Mail, FileText
} from "lucide-react";

export default function CreateListingPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories");
      } finally {
        setFetchingCats(false);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) {
        alert("Please describe the business (e.g., 'Modern Luxury Spa Interior')");
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
        if (!res.ok) throw new Error(data.error || "Failed");
        
        setFormData({ ...formData, image: data.url }); 
    } catch (error) {
        alert("AI Service busy. Please try again in a moment.");
    } finally {
        setGenerating(false);
    }
  };

  const handleDeleteImage = () => {
    setFormData({ ...formData, image: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/listings"); 
      } else {
        const errorData = await res.text();
        alert(`Error: ${errorData}`);
      }
    } catch (error) {
      alert("Something went wrong with the database connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/listings" 
          className="bg-white p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">CREATE LISTING</h1>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Add a new business to the JustDial Index</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tighter">
              <Store size={22} className="text-blue-600" /> Basic Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Identity Name <span className="text-red-500">*</span></label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. The Grand Heritage Hotel"
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry Category <span className="text-red-500">*</span></label>
                <div className="relative mt-2">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    required
                  >
                    <option value="">-- Select Industry Type --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                {fetchingCats && <p className="text-[10px] text-blue-500 font-bold mt-2 animate-pulse">Syncing categories from TiDB...</p>}
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe services, specialities, and hours..."
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tighter">
              <Phone size={22} className="text-emerald-500" /> Communication details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Phone</label>
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                <input 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@business.com"
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Website</label>
                <div className="relative mt-2">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.company.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
              <MapPin size={22} className="text-red-500" /> Physical Location
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address <span className="text-red-500">*</span></label>
                <input 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Building No, Street Name"
                  className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New Delhi"
                    className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
                  <input 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="110001"
                    className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
              <ImageIcon size={22} className="text-purple-600" /> Visual Assets
            </h2>
            
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
                <button 
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-tighter rounded-xl transition-all ${imageMode === "url" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                >
                    <LinkIcon size={14} /> Link
                </button>
                <button 
                    type="button"
                    onClick={() => setImageMode("ai")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-tighter rounded-xl transition-all ${imageMode === "ai" ? "bg-white text-purple-600 shadow-sm" : "text-slate-500"}`}
                >
                    <Sparkles size={14} /> AI Generate
                </button>
            </div>

            {imageMode === "url" ? (
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Remote Image URL</label>
                    <input 
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                    />
                </div>
            ) : (
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AI Creative Prompt</label>
                    <div className="flex gap-2">
                        <input 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe the business vibe..."
                            className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white transition-all"
                        />
                        <button 
                            type="button"
                            onClick={handleGenerateImage}
                            disabled={generating}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-2xl disabled:opacity-70 transition-all shadow-lg shadow-purple-200 active:scale-90"
                        >
                            {generating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        </button>
                    </div>
                </div>
            )}
            
            {formData.image && (
              <div className="mt-6 relative aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-2xl group ring-1 ring-slate-100">
                  <img 
                      src={formData.image} 
                      alt="Listing Preview" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                      <button 
                          type="button"
                          onClick={handleDeleteImage}
                          className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all transform scale-90 group-hover:scale-100 shadow-xl"
                      >
                          <Trash2 size={24} />
                      </button>
                  </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#0073c1] text-white py-5 rounded-[2rem] font-black uppercase tracking-[3px] shadow-2xl shadow-blue-500/30 transition-all hover:bg-[#005a9c] hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Commit to Database</>}
            </button>
            <p className="text-[9px] text-center text-slate-400 font-bold mt-4 uppercase tracking-widest">Listing will be marked as verified by default (Admin privilege)</p>
          </div>

        </div>
      </form>
    </div>
  );
}