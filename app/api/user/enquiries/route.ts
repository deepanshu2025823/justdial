// app/api/user/enquiries/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return new NextResponse("User ID required", { status: 400 });

    const enquiries = await db.enquiry.findMany({
      where: { userId },
      include: {
        business: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(enquiries);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}