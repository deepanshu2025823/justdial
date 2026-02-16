// app/admin/listings/create/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, Save, Loader2, Store, MapPin, 
  Phone, Globe, Image as ImageIcon, Layers, Sparkles, Trash2, Link as LinkIcon
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
        alert("Please enter a prompt description");
        return;
    }
    setGenerating(true);
    try {
        const res = await fetch("/api/generate-image", {
            method: "POST",
            body: JSON.stringify({ prompt: aiPrompt })
        });
        
        if (!res.ok) throw new Error("Failed to generate");
        
        const data = await res.json();
        setFormData({ ...formData, image: data.url }); 
    } catch (error) {
        alert("Could not generate image. Check your API Key.");
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
        alert("Failed to create listing. Please check required fields.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/listings" 
          className="bg-white p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Business</h1>
          <p className="text-sm text-slate-500">Fill in the details to create a new listing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Store size={20} className="text-blue-600" /> Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Name <span className="text-red-500">*</span></label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Green Leaf Restaurant"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Category <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <select 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                    required
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                {fetchingCats && <p className="text-xs text-slate-400 mt-1">Loading categories...</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about the business..."
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Phone size={20} className="text-green-600" /> Contact Info
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@business.com"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input 
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.business.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-red-500" /> Location
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Address <span className="text-red-500">*</span></label>
                <input 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Shop No. 4, Main Market"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New Delhi"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pincode</label>
                  <input 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="110001"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-purple-600" /> Media
            </h2>
            
            <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
                <button 
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${imageMode === "url" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    <LinkIcon size={16} /> Link
                </button>
                <button 
                    type="button"
                    onClick={() => setImageMode("ai")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${imageMode === "ai" ? "bg-white text-purple-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    <Sparkles size={16} /> AI Generate
                </button>
            </div>

            {imageMode === "url" ? (
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Image URL</label>
                    <input 
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Describe your image</label>
                    <div className="flex gap-2">
                        <input 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="e.g. Modern coffee shop with warm lighting"
                            className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                        />
                        <button 
                            type="button"
                            onClick={handleGenerateImage}
                            disabled={generating}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl disabled:opacity-70 transition-colors"
                        >
                            {generating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">Powered by Manee & Imagen 3</p>
                </div>
            )}
            
            {formData.image && (
              <div className="mt-4 relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
                  <img 
                      src={formData.image} 
                      alt="AI Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                          console.error("Image render error");
                      }}
                  />
        
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, image: "" })}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                          <Trash2 size={20} />
                      </button>
                  </div>
              </div>
          )}
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Publish Listing</>}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}