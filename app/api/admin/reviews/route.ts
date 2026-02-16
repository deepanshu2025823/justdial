// app/api/admin/reviews/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const reviews = await db.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        business: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new NextResponse("ID Required", { status: 400 });

    await db.review.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Review Deleted" });
  } catch (error) {
    return new NextResponse("Delete Failed", { status: 500 });
  }
}