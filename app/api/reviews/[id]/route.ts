// app/api/reviews/[id]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;

    await db.review.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("[REVIEW_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { rating, comment } = body;

    if (!rating) {
      return new NextResponse("Rating is required", { status: 400 });
    }

    const updatedReview = await db.review.update({
      where: { id },
      data: {
        rating: Number(rating),
        comment: comment || ""
      }
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("[REVIEW_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}