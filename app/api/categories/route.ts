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
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, image } = body;

    const slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const category = await db.category.create({
      data: { name, slug, image }
    });

    return NextResponse.json(category);
  } catch (error) {
    return new NextResponse("Duplicate Name or Database Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const { name, image } = body;

    if (!id) return new NextResponse("ID Required", { status: 400 });

    const slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const updated = await db.category.update({
      where: { id },
      data: { name, slug, image }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return new NextResponse("Update Failed", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("ID required", { status: 400 });

    await db.category.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return new NextResponse("Error deleting", { status: 500 });
  }
}