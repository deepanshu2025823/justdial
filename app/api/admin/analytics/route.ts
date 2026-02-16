// app/api/analytics/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [totalUsers, totalBusinesses, totalEnquiries, categories] = await Promise.all([
      db.user.count(),
      db.business.count(),
      db.enquiry.count(),
      db.category.findMany({
        select: {
          name: true,
          _count: { select: { businesses: true } }
        }
      })
    ]);

    return NextResponse.json({
      stats: {
        users: totalUsers,
        listings: totalBusinesses,
        leads: totalEnquiries,
        activeSectors: categories.length
      },
      categoryDistribution: categories.map(c => ({
        name: c.name,
        count: c._count.businesses
      }))
    });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}