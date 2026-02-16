// app/api/businesses/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const businesses = await db.business.findMany({
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(businesses);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, categoryId, phone, email, website, address, city, pincode, description, image } = body;

    if (!name || !categoryId || !address) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const business = await db.business.create({
      data: {
        name,
        categoryId,
        phone,
        email,
        website,
        address,
        city,
        pincode,
        description,
        isVerified: true,
        images: image ? {
          create: { url: image }
        } : undefined
      }
    });

    return NextResponse.json(business);
  } catch (error) {
    console.error("[BUSINESS_POST]", error);
    return new NextResponse("Failed to create business", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new NextResponse("ID Required", { status: 400 });

    await db.business.delete({ where: { id } });
    return NextResponse.json({ message: "Business Deleted" });
  } catch (error) {
    return new NextResponse("Delete Failed", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { isVerified } = await req.json();

    if (!id) return new NextResponse("ID Required", { status: 400 });

    const updated = await db.business.update({
      where: { id },
      data: { isVerified }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return new NextResponse("Update Failed", { status: 500 });
  }
}