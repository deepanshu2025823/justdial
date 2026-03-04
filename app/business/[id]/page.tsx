// app/business/[id]/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Phone, Globe, MapPin, Star, CheckCircle, 
  Send, Loader2, MessageSquare, ShieldCheck, Mail,
  Trash2, Edit3 
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewModal from "@/components/ReviewModal"; 

export default function BusinessDetails() {
  const { id } = useParams();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false); 
  const [selectedReview, setSelectedReview] = useState<any>(null); 

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    message: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedUser = localStorage.getItem("jd_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setFormData(prev => ({ 
        ...prev, 
        name: parsedUser.name || "", 
        mobile: parsedUser.phone || "" 
      }));
    }

    fetchBusinessData();
  }, [id]);

  const fetchBusinessData = () => {
    fetch(`/api/businesses/${id}`)
      .then(res => res.json())
      .then(data => {
        setBusiness(data);
        setLoading(false);
      })
      .catch(err => console.error("Failed to load business data from TiDB"));
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        alert("Review removed successfully.");
        fetchBusinessData();
      }
    } catch (err) {
      alert("Failed to delete review. Please try again.");
    }
  };

  const handleEditReview = (review: any) => {
    setSelectedReview(review);
    setIsReviewOpen(true);
  };

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          businessId: id,
          userId: user?.id || user?._id || null
        }),
      });
      if (res.ok) {
        alert("Enquiry sent successfully! It will now appear on your dashboard.");
        setFormData(prev => ({ ...prev, message: "" }));
      }
    } catch (err) {
      alert("Failed to send enquiry.");
    } finally {
      setSending(false);
    }
  };

  const scrollToDeal = () => {
    const element = document.getElementById("enquiry-form");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const openReviewHandler = () => {
    const savedUser = localStorage.getItem("jd_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser && (parsedUser.id || parsedUser._id)) {
        setUser(parsedUser); 
        setIsReviewOpen(true);
        return;
      }
    }
    alert("Please Sign In to rate this business.");
  };

  if (loading) return (
    <div className="flex flex-col h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#0073c1] mb-4" size={48} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Accessing Local Index...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1">
        <div className="bg-white border-b pt-12 pb-12 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-blue-50 text-[#0073c1] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  <CheckCircle size={12} className="inline mr-1" /> Verified Listing
                </span>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < (business.rating || 4) ? "currentColor" : "none"} className={i < (business.rating || 4) ? "" : "text-slate-200"} />
                  ))}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">
                {business.name}
              </h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8 max-w-2xl italic">
                "{business.description || "Leading service provider in the region offering premium local solutions."}"
              </p>
              
              <div className="flex flex-wrap gap-8 border-t border-slate-50 pt-8">
                <div className="flex items-center gap-3 text-slate-700 font-black uppercase text-[11px] tracking-widest">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500"><MapPin size={20} /></div>
                  <span>{business.city}, India</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-black uppercase text-[11px] tracking-widest">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><Phone size={20} /></div>
                  <span>{showFullNumber ? `${business.phone}` : `${business.phone.substring(0, 5)}XXXXX`}</span>
                </div>
                <button 
                  onClick={openReviewHandler}
                  className="flex items-center gap-2 px-6 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-100 transition-all shadow-sm"
                >
                  <Star size={16} fill="currentColor" /> Rate Business
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <ShieldCheck className="absolute -right-6 -bottom-6 text-white/5 w-40 h-40" />
               <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">JD Trust Score</h3>
               <p className="text-blue-400 text-xs uppercase font-black tracking-[2px] mb-8">Premium Authenticated</p>
               <div className="space-y-4 relative z-10">
                 <button onClick={() => setShowFullNumber(!showFullNumber)} className="w-full bg-[#0073c1] hover:bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-[3px] text-xs shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                   <Phone size={16} fill="white"/> {showFullNumber ? "Hide Number" : "Show Number"}
                 </button>
                 <button onClick={scrollToDeal} className="w-full bg-white/10 hover:bg-white/20 py-5 rounded-2xl font-black uppercase tracking-[3px] text-xs backdrop-blur-md active:scale-95">
                   Get Best Deal
                 </button>
               </div>
            </div>
          </div>
        </div>

        <div id="enquiry-form" className="max-w-6xl mx-auto px-6 mt-16 mb-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
             <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
               <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
                 <MessageSquare className="text-[#0073c1]" size={32} /> Fast Enquiry
               </h2>
               <form onSubmit={handleEnquiry} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold shadow-inner" />
                   <input required value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} placeholder="Mobile Number" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold shadow-inner" />
                 </div>
                 <textarea rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Requirement Details..." className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none font-bold resize-none shadow-inner" />
                 <button disabled={sending} className="w-full bg-[#0073c1] text-white py-6 rounded-3xl font-black uppercase tracking-[4px] text-xs shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                   {sending ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Commit Enquiry</>}
                 </button>
               </form>
             </div>

             <div className="space-y-8">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
                  <Star className="text-amber-400" fill="currentColor" /> Verified Reviews
                </h2>
                {business.reviews && business.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {business.reviews.map((rev: any) => {
                      const isOwner = user?.id === rev.userId || user?._id === rev.userId;
                      
                      return (
                        <div key={rev.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-md group animate-in fade-in duration-500">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-1 text-amber-400">
                              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-slate-200"} />)}
                            </div>
                            
                            {isOwner ? (
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <button 
                                  onClick={() => handleEditReview(rev)} 
                                  className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                  title="Edit Review"
                                >
                                  <Edit3 size={14}/>
                                </button>
                                <button 
                                  onClick={() => handleDeleteReview(rev.id)} 
                                  className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                  title="Delete Review"
                                >
                                  <Trash2 size={14}/>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 font-bold leading-relaxed italic">"{rev.comment}"</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No verified feedback found for this index.</p>
                  </div>
                )}
             </div>
          </div>

          <aside className="space-y-8">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
               <h3 className="text-xs font-black text-slate-800 uppercase tracking-[3px] mb-8 border-b pb-4">Business Dossier</h3>
               <div className="space-y-6">
                  <div className="group">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Electronic Mail</p>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600 transition-colors group-hover:text-blue-500">
                      <Mail size={16} className="text-blue-500"/> {business.email || "Not publicly listed"}
                    </div>
                  </div>
                  <div className="group">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational Support</p>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600 transition-colors group-hover:text-emerald-500">
                      <Phone size={16} className="text-emerald-500"/> {showFullNumber ? business.phone : `${business.phone.substring(0, 5)}XXXXX`}
                    </div>
                  </div>
               </div>
             </div>
             
             <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <ShieldCheck className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                <p className="text-xs font-black uppercase tracking-[2px] mb-2">Safety Policy</p>
                <p className="text-xs font-bold leading-relaxed tracking-tighter uppercase">Activity secured by TiDB Serverless Encryption.</p>
             </div>
          </aside>
        </div>
      </main>

      <Footer />
      
      <ReviewModal 
        businessId={id} 
        userId={user?.id || user?._id}
        initialData={selectedReview} 
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedReview(null);
        }}
        onSuccess={() => {
          fetchBusinessData();
        }}
      />
    </div>
  );
}