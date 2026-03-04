// app/api/businesses/trending/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const trending = await db.business.findMany({
      where: { isVerified: true },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        category: { select: { name: true } },
        images: { take: 1 }
      }
    });

    return NextResponse.json(trending);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}