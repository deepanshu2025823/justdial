// app/api/businesses/[id]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const business = await db.business.findUnique({
      where: { id },
      include: { images: true }
    });

    if (!business) return new NextResponse("Not Found", { status: 404 });
    return NextResponse.json(business);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, categoryId, phone, email, website, address, city, pincode, description, image } = body;

    const updatedBusiness = await db.business.update({
      where: { id },
      data: { name, categoryId, phone, email, website, address, city, pincode, description }
    });

    if (image) {
      await db.businessImage.deleteMany({ where: { businessId: id } });
      await db.businessImage.create({
        data: { url: image, businessId: id }
      });
    }

    return NextResponse.json(updatedBusiness);
  } catch (error) {
    return new NextResponse("Update Failed", { status: 500 });
  }
}