"use client";
import Image from "next/image";

const sections = [
  {
    title: "Wedding Requisites",
    items: [
      { name: "Banquet Halls", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/banquethalls_rectangle_2024.webp" },
      { name: "Bridal Requisite", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bridalrequisite_rectangle_2024.webp" },
      { name: "Caterers", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/banquethalls_rectangle_2024.webp" }
    ]
  },
  {
    title: "Beauty & Spa",
    items: [
      { name: "Beauty Parlours", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/beautyparlours_rectangle_2024.webp" },
      { name: "Spa & Massages", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/spamassages_rectangle_2024.webp" },
      { name: "Salons", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/salons_rectangle_2024.webp" }
    ]
  },
  {
    title: "Repairs & Services",
    items: [
      { name: "AC Service", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/hkim_acrepair.png" },
      { name: "Car Service", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/carservice_rectangle_2024.webp" },
      { name: "Bike Service", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bikeservice_rectangle_2024.webp" }
    ]
  },
  {
    title: "Daily Needs",
    items: [
      { name: "Movies", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/movies_rectangle_2024.webp" },
      { name: "Grocery", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/grocery_rectangle_2024.webp" },
      { name: "Electricians", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/electricians_rectangle_2024.webp" }
    ]
  }
];

const bookingSections = [
  {
    title: "Bills & Recharge",
    sub: "Pay your bills & recharge instantly with Justdial",
    icon: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bharat_billpay_Newlogo.svg",
    items: [
      { name: "Mobile", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_mobile.svg" },
      { name: "Electricity", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_electricity.svg" },
      { name: "DTH", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_dth.svg" },
      { name: "Water", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_water.svg" },
      { name: "Gas", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_gas.svg" },
      { name: "Insurance", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_insurance.svg" }
    ]
  },
  {
    title: "Travel Bookings",
    sub: "Instant ticket bookings for your best travel experience",
    items: [
      { name: "Flight", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_flight.svg", note: "Powered By Easemytrip.com", noteColor: "text-green-600" },
      { name: "Bus", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_bus.svg", note: "Affordable Rides", noteColor: "text-green-600" },
      { name: "Train", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_train.svg" },
      { name: "Hotel", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_hotels.svg", note: "Budget-friendly Stay", noteColor: "text-green-600" },
      { name: "Car Rentals", img: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/bt_carhire.svg", note: "Drive Easy Anywhere", noteColor: "text-green-600" }
    ]
  }
];

export default function CardSection() {
  return (
    <section className="max-w-[1300px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div 
            key={idx} 
            className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <h2 className="text-[17px] font-bold text-gray-800 mb-5 flex justify-between items-center">
              {section.title}
              <span className="text-[12px] text-blue-600 font-semibold cursor-pointer hover:underline">View All</span>
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {section.items.map((item, i) => (
                <div key={i} className="group cursor-pointer text-center">
                  <div className="relative aspect-[4/3] mb-3 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-[13px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors leading-tight">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm mt-10 bg-white">
        {bookingSections.map((section, idx) => (
          <div key={idx} className={`p-8 ${idx === 0 ? 'border-b border-gray-100' : ''}`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-10">
              <div className="lg:w-1/4">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-[22px] font-extrabold text-gray-900">{section.title}</h2>
                  {section.icon && <img src={section.icon} alt="icon" className="h-5" />}
                </div>
                <p className="text-[14px] text-gray-500 mb-4 leading-snug">{section.sub}</p>
                <button className="text-[#0073c1] font-bold text-[14px] hover:underline">Explore More</button>
              </div>

              <div className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-6">
                {section.items.map((item, i) => (
                  <div key={i} className="flex flex-col items-center group cursor-pointer">
                    <div className="w-[72px] h-[72px] flex items-center justify-center border border-gray-100 rounded-2xl mb-3 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1 bg-white">
                      <img src={item.img} alt={item.name} className="w-20 h-20 object-contain" />
                    </div>
                    <span className="text-[13px] font-bold text-gray-800 mb-1">{item.name}</span>
                    {item.note && <span className={`${item.noteColor} text-[10px] font-medium text-center leading-tight`}>{item.note}</span>}
                  </div>
                ))}
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}