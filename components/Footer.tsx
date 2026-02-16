// components/Footer.tsx

"use client";
import React from "react";
import { Facebook, Youtube, Instagram, Linkedin, Twitter } from "lucide-react";

interface QuickLink {
  name: string;
  col: number;
}

interface SocialIconProps {
  icon: React.ReactNode;
  bg: string;
}

const quickLinks: QuickLink[] = [
  { name: "About us", col: 1 }, { name: "Advertise", col: 2 },
  { name: "Investor Relations", col: 1 }, { name: "Media", col: 2 },
  { name: "We're hiring", col: 1 }, { name: "Testimonials", col: 2 },
  { name: "Customer Care", col: 1 }, { name: "Feedback", col: 2 },
  { name: "Free Listing", col: 1 }, { name: "Business Badge", col: 2 },
  { name: "What's New", col: 1 }, { name: "Jd Collection", col: 2 },
  { name: "Report a Bug", col: 1 }, { name: "Client Success Videos", col: 2 },
  { name: "B2B Sitemap", col: 1 }, { name: "B2B India Sitemap", col: 2 },
  { name: "Sitemap", col: 1 }, { name: "Return & Exchange Policy", col: 2 },
];

const jdVerticals: string[][] = [
  ["B2B", "All India", "Doctors", "Bills & Recharge", "Cricket", "Guides"],
  ["Accommodation", "Advertising & Pr", "Agriculture", "Apparel", "Astrology", "Automobiles & Two Wheelers"],
  ["Beauty & Personal Care", "Business & Legal", "Chemicals", "Construction & Real Estate", "Education", "Electronic Component"],
  ["Electronics", "Energy", "Engineering", "Entertainment", "Events & Wedding", "Food & Beverage"],
  ["Furniture", "Health & Medical", "Home & Garden", "Housekeeping & Facility Management", "Industrial Plants & Machinery", "It Components"],
  ["Jewellery", "Lights & Lighting", "Luggage Bags & Cases", "Office & School Supplies", "Packaging & Printing", "Pet & Pet Supplies"],
  ["Placements", "Public", "Restaurant", "Rubber & Plastics", "Security & Protection", "Sports & Entertainment"],
  ["Textile & Leather", "Toys & Games", "Transportation & Shipping", "Travel", "Watches & Eyewear"]
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-24 md:pb-6">
      <div className="max-w-[1300px] mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          
          <div className="flex items-center gap-4">
            <span className="text-[18px] font-bold text-gray-800">Follow us on</span>
            <div className="flex gap-2">
              <SocialIcon icon={<Facebook size={20} fill="currentColor" />} bg="bg-[#3b5998]" />
              <SocialIcon icon={<Youtube size={20} />} bg="bg-[#ff0000]" />
              <SocialIcon icon={<Instagram size={20} />} bg="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" />
              <SocialIcon icon={<Linkedin size={20} fill="currentColor" />} bg="bg-[#0077b5]" />
              <SocialIcon icon={<Twitter size={20} fill="currentColor" />} bg="bg-black" />
            </div>
          </div>

          <div className="flex gap-3">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
              alt="Get it on Google Play" 
              className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
              alt="Download on the App Store" 
              className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" 
            />
          </div>
        </div>

        <hr className="border-gray-100 mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-3">
            <h3 className="text-[16px] font-bold text-gray-900 mb-6 uppercase tracking-wider">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {quickLinks.map((link, i) => (
                <a key={i} href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">{link.name}</a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-9">
            <h3 className="text-[16px] font-bold text-gray-900 mb-6 uppercase tracking-wider">JD Verticals</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-3">
              {jdVerticals.flat().map((item, i) => (
                <a key={i} href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors truncate">{item}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-50 flex justify-center md:justify-start items-center text-[12px] text-gray-400 font-medium">
          <span>Copyrights 2008-26 . JustDial . All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, bg }: SocialIconProps) {
  return (
    <div className={`${bg} text-white p-2 rounded-full cursor-pointer hover:opacity-80 transition-opacity shadow-sm flex items-center justify-center`}>
      {icon}
    </div>
  );
}