// app/api/reviews/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, comment, businessId, userId } = body;

    if (!rating || !businessId) {
      return new NextResponse("Rating and Business ID are required", { status: 400 });
    }

    const review = await db.review.create({
      data: {
        rating: Number(rating),
        comment: comment || "",
        business: { connect: { id: businessId } },
        ...(userId && { user: { connect: { id: userId } } }),
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("PRISMA ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}