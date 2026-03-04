// app/api/card-sections/route.ts

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.category.findMany({
      include: {
        businesses: {
          take: 3, 
          orderBy: { createdAt: 'desc' }
        }
      },
      take: 4 
    });
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}