// components/ReviewModal.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Star, X, Loader2, Send } from "lucide-react";

export default function ReviewModal({ businessId, userId, isOpen, onClose, onSuccess, initialData }: any) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating);
      setComment(initialData.comment);
    } else {
      setRating(0);
      setComment("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating!");

    setLoading(true);
    try {
      const isEdit = !!initialData;
      const url = isEdit ? `/api/reviews/${initialData.id}` : "/api/reviews";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rating, 
          comment, 
          businessId, 
          userId 
        }),
      });

      if (res.ok) {
        onSuccess(); 
        onClose();
      } else {
        alert("Failed to save review");
      }
    } catch (err) {
      console.error("Review Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
            {initialData ? "Edit Your Review" : "Write a Review"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={36} 
                    fill={(hover || rating) >= star ? "#fbbf24" : "none"} 
                    className={(hover || rating) >= star ? "text-amber-400" : "text-slate-200"}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none font-bold transition-all resize-none shadow-inner"
          />

          <button
            disabled={loading}
            className="w-full bg-[#0073c1] text-white py-5 rounded-[2rem] font-black uppercase tracking-[3px] text-xs shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> {initialData ? "Update Review" : "Publish Review"}</>}
          </button>
        </form>
      </div>
    </div>
  );
}