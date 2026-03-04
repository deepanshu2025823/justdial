// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Restaurants", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/restaurant-2022.svg", slug: "restaurants" },
    { name: "Hotels", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/hotel-2022.svg", slug: "hotels" },
    { name: "Beauty Spa", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/beauty.svg", slug: "beauty-spa" },
    { name: "Home Decor", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/homedecor.svg", slug: "home-decor" },
    { name: "Wedding Planning", image: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/hotkey_wedding_icon.gif", slug: "wedding-planning" },
    { name: "Education", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/education.svg", slug: "education" },
    { name: "Rent & Hire", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/renthire.svg", slug: "rent-hire" },
    { name: "Hospitals", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/hospitals.svg", slug: "hospitals" },
    { name: "Contractors", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/contractors.svg", slug: "contractors" },
    { name: "Pet Shops", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/petshops.svg", slug: "pet-shops" },
    { name: "PG/Hostels", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/pg-hostels-rooms.svg", slug: "pg-hostels" },
    { name: "Estate Agent", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/estate-agent.svg", slug: "estate-agent" },
    { name: "Dentists", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/dentists.svg", slug: "dentists" },
    { name: "Gym", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/gym.svg", slug: "gym" },
    { name: "Loans", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/loans.svg", slug: "loans" },
    { name: "Event Organisers", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/eventorganisers.svg", slug: "event-organisers" },
    { name: "Driving Schools", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/driving_school_2023.svg", slug: "driving-schools" },
    { name: "Packers & Movers", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/packersmovers.svg", slug: "packers-movers" },
    { name: "Courier Service", image: "https://akam.cdn.jdmagicbox.com/images/icons/newwap/newhotkey/courier_2023.svg", slug: "courier-service" }
  ];

  console.log('--- Starting Full Seeding (19 Dynamic Items) ---');
  for (const cat of categories) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { image: cat.image },
      create: cat,
    });
    console.log(`Synced: ${result.name}`);
  }
  console.log('--- Seeding Completed ---');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });