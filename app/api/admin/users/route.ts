// app/api/admin/users/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse("Sync Failed", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role } = body;

    const user = await db.user.create({
      data: { name, email, phone, password, role }
    });
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Email already exists in database", { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) return new NextResponse("Target ID Required", { status: 400 });

    const updatedUser = await db.user.update({
      where: { id },
      data: { ...body }
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return new NextResponse("Update Rejected", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("ID Required", { status: 400 });

    await db.user.delete({ where: { id } });
    return NextResponse.json({ message: "Entity Deleted" });
  } catch (error) {
    return new NextResponse("Cascade Delete Failed", { status: 500 });
  }
}