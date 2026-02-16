// app/api/categories/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("DB Error:", error);
    return new NextResponse("Database Error", { status: 500 });
  }
}