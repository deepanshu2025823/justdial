// app/api/banners/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const banners = await db.banner.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("BANNER_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, imageUrl, link, isActive } = body;

    if (!imageUrl) {
        return new NextResponse("Image URL is required", { status: 400 });
    }

    if (imageUrl.length > 5000000) { 
        return new NextResponse("Image size too large. Please compress before uploading.", { status: 413 });
    }

    const banner = await db.banner.create({
      data: { 
        title, 
        imageUrl, 
        link, 
        isActive: isActive ?? true 
      }
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("BANNER_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return new NextResponse("Banner ID is required", { status: 400 });

    const body = await req.json();
    const { title, imageUrl, link, isActive } = body;

    if (imageUrl && imageUrl.length > 5000000) { 
        return new NextResponse("Image size too large. Please compress.", { status: 413 });
    }

    const updatedBanner = await db.banner.update({
      where: { id },
      data: { 
          title, 
          ...(imageUrl && { imageUrl }), 
          link, 
          isActive 
      }
    });

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error("BANNER_PATCH_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return new NextResponse("Banner ID is required", { status: 400 });

    await db.banner.delete({
      where: { id }
    });

    return new NextResponse("Banner deleted successfully", { status: 200 });
  } catch (error) {
    console.error("BANNER_DELETE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}