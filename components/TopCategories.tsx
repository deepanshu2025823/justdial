"use client";
import Image from "next/image";

const categories = [
  { name: "Restaurants", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/restaurant-2022.svg" },
  { name: "Hotels", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/hotel-2022.svg" },
  { name: "Beauty Spa", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/beauty.svg" },
  { name: "Home Decor", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/homedecor.svg" },
  { name: "Wedding Planning", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/hotkey_wedding_icon.gif", isSpecial: true },
  { name: "Education", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/education.svg" },
  { name: "Rent & Hire", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/renthire.svg" },
  { name: "Hospitals", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/hospitals.svg" },
  { name: "Contractors", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/contractors.svg" },
  { name: "Pet Shops", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/petshops.svg" },
  { name: "PG/Hostels", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/pg-hostels-rooms.svg" },
  { name: "Estate Agent", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/estate-agent.svg" },
  { name: "Dentists", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/dentists.svg" },
  { name: "Gym", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/gym.svg" },
  { name: "Loans", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/loans.svg" },
  { name: "Event Organisers", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/eventorganisers.svg" },
  { name: "Driving Schools", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/driving_school_2023.svg" },
  { name: "Packers & Movers", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/packersmovers.svg" },
  { name: "Courier Service", img: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/courier_2023.svg" },
  { name: "Popular Categories", img: "https://cdn-icons-png.flaticon.com/512/8106/8106985.png", isMenu: true },
];

export default function TopCategories() {
  return (
    <section className="max-w-[1300px] mx-auto px-4 py-10 mt-5">
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-y-8 gap-x-2">
        {categories.map((cat, i) => (
          <div 
            key={i} 
            className="group flex flex-col items-center text-center cursor-pointer transition-transform duration-200 hover:-translate-y-1"
          >
            {/* Icon Container */}
            <div className={`
              relative w-[68px] h-[68px] mb-3 flex items-center justify-center rounded-2xl border border-gray-100 shadow-sm transition-all
              group-hover:shadow-md group-hover:border-blue-100 
              ${cat.isSpecial ? 'bg-[#ffebf3] border-none overflow-hidden' : 'bg-white'}
              ${cat.isMenu ? 'bg-white' : ''}
            `}>
              <img 
                src={cat.img} 
                alt={cat.name} 
                className={`
                  ${cat.isSpecial ? 'w-full h-full object-cover scale-110' : 'w-10 h-10'}
                  transition-transform duration-300 group-hover:scale-110
                `}
              />
              
              {/* Wedding special banner text placeholder if needed */}
              {cat.isSpecial && (
                <div className="absolute bottom-0 w-full bg-pink-500 text-[8px] text-white font-bold py-0.5 uppercase">
                  Wedding
                </div>
              )}
            </div>

            {/* Label */}
            <p className="text-[13px] text-[#222] font-medium leading-tight px-1 max-w-[90px] group-hover:text-blue-600 transition-colors">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}