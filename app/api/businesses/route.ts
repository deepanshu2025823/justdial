// app/api/businesses/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const businesses = await db.business.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    return NextResponse.json(businesses);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, description, address, city, 
      pincode, phone, email, website, 
      categoryId, image 
    } = body;

    if (!name || !address || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const business = await db.business.create({
      data: {
        name,
        description,
        address,
        city,
        pincode,
        phone,
        email,
        website,
        categoryId,
        isVerified: true, 
        images: image ? {
            create: {
                url: image
            }
        } : undefined
      }
    });

    return NextResponse.json(business);
  } catch (error) {
    console.log("[BUSINESS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}