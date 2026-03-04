// app/api/categories/route.ts

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET_CATEGORIES_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, image, featuredImage, description, color } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (image && image.length > 5000000) return new NextResponse("Icon Image too large.", { status: 413 });
    if (featuredImage && featuredImage.length > 5000000) return new NextResponse("Featured Image too large.", { status: 413 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await db.category.create({
      data: {
        name,
        slug,
        image,
        featuredImage, 
        description, 
        color       
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("POST_CATEGORY_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const body = await req.json();
    const { name, image, featuredImage, description, color } = body;

    if (image && image.length > 5000000) return new NextResponse("Icon Image too large.", { status: 413 });
    if (featuredImage && featuredImage.length > 5000000) return new NextResponse("Featured Image too large.", { status: 413 });

    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : undefined;

    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(image !== undefined && { image }),
        ...(featuredImage !== undefined && { featuredImage }), 
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color })
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("PATCH_CATEGORY_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    await db.category.delete({
      where: { id }
    });

    return new NextResponse("Category deleted successfully", { status: 200 });
  } catch (error) {
    console.error("DELETE_CATEGORY_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}