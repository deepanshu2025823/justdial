// app/api/businesses/search/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const city = searchParams.get("city") || "";

    const businesses = await db.business.findMany({
      where: {
        isVerified: true,
        AND: [
          query ? { name: { contains: query } } : {},
          categoryId ? { categoryId: categoryId } : {},
          city ? { city: { contains: city } } : {},
        ],
      },
      include: {
        category: { select: { name: true } },
        images: { take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(businesses);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}