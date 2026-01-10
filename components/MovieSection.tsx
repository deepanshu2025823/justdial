"use client";
import React, { useRef } from "react";
import { ChevronRight, ChevronLeft, ThumbsUp } from "lucide-react";

const movies = [
  { name: "The Raja Saab", lang: "Hindi • 2D", rating: "92%", img: "https://images.jdmagicbox.com/movies/centralized_161150492025_03_28_05_56_18_220.jpg" },
  { name: "Dhurandhar", lang: "Hindi • 2D", rating: "92%", img: "https://images.jdmagicbox.com/movies/centralized_162114032025_07_10_12_54_35_220.jpg" },
  { name: "Ikkis", lang: "Hindi • 2D", rating: "20%", img: "https://images.jdmagicbox.com/movies/centralized_161391222025_09_19_12_14_40_220.jpg" },
  { name: "Avatar Fire And Ash", lang: "English • 3D", rating: "100%", img: "https://images.jdmagicbox.com/movies/centralized_161957812025_07_04_01_17_01_220.jpg" },
  { name: "Haq", lang: "Hindi • 2D", rating: "90%", img: "https://images.jdmagicbox.com/movies/centralized_162185652025_11_10_02_19_27_220.jpg" }
];

export default function MovieSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; 
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-[1300px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#222] leading-tight">Recommended Movies</h2>
          <p className="text-gray-500 text-sm md:text-base mt-1 font-medium">The best of cinema, handpicked for you</p>
        </div>
        <button className="text-pink-600 font-bold flex items-center gap-0.5 text-sm whitespace-nowrap pt-1">
          See All <ChevronRight size={16} />
        </button>
      </div>

      {/* Horizontal Scroll Wrapper */}
      <div className="relative group">
        {/* Navigation Buttons (Desktop Only) */}
        <button 
          onClick={() => scroll("left")}
          className="absolute -left-4 top-[35%] bg-white w-10 h-10 rounded-full shadow-xl border border-gray-100 items-center justify-center z-20 hover:bg-gray-50 transition-all hidden md:flex"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
          style={{ 
            scrollbarWidth: 'none',  
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          {/* Hide Scrollbar for Chrome/Safari */}
          <style jsx>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {movies.map((movie, i) => (
            <div 
              key={i} 
              className="min-w-[170px] xs:min-w-[200px] md:min-w-[240px] flex-shrink-0 cursor-pointer snap-start group/card"
            >
              {/* Poster Container */}
              <div className="relative aspect-[2/3] rounded-xl md:rounded-2xl overflow-hidden mb-3 shadow-md ring-1 ring-black/5">
                <img 
                  src={movie.img} 
                  alt={movie.name} 
                  className="w-full h-full object-cover transition-transform duration-500 md:group-hover/card:scale-110" 
                />
                
                {/* Overlay (Desktop) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:group-hover/card:opacity-100 transition-opacity" />

                {/* Trending Badge */}
                {parseInt(movie.rating) >= 90 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-[9px] md:text-[10px] text-white font-bold px-1.5 py-0.5 rounded shadow-md">
                    TRENDING
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1 border border-white/10">
                  <ThumbsUp size={12} className="text-green-500 fill-green-500" />
                  <span className="text-[10px] md:text-[12px] font-bold text-white">{movie.rating}</span>
                </div>
              </div>

              {/* Movie Details */}
              <div className="px-0.5">
                <h3 className="text-[15px] md:text-lg font-bold text-gray-900 leading-tight mb-1 truncate">
                  {movie.name}
                </h3>
                <p className="text-[12px] md:text-sm text-gray-500 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> {movie.lang}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll("right")}
          className="absolute -right-4 top-[35%] bg-white w-10 h-10 rounded-full shadow-xl border border-gray-100 items-center justify-center z-20 hover:bg-gray-50 transition-all hidden md:flex"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      </div>
    </section>
  );
}