// app/api/services/route.ts

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(services);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, image, link, section, note, noteColor } = body;

    const service = await db.service.create({
      data: { name, image, link, section, note, noteColor }
    });

    return NextResponse.json(service);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("ID Required", { status: 400 });

    const body = await req.json();
    const updated = await db.service.update({
      where: { id },
      data: { ...body }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("ID Required", { status: 400 });

    await db.service.delete({ where: { id } });
    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}