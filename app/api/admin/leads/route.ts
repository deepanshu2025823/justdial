// app/api/admin/leads/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const leads = await db.enquiry.findMany({
      include: {
        business: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(leads);
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { status } = await req.json();

    if (!id) return new NextResponse("ID Required", { status: 400 });

    const updatedLead = await db.enquiry.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    return new NextResponse("Update Failed", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("ID Required", { status: 400 });

    await db.enquiry.delete({ where: { id } });
    return NextResponse.json({ message: "Lead Deleted" });
  } catch (error) {
    return new NextResponse("Delete Failed", { status: 500 });
  }
}