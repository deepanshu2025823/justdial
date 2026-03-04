// app/api/user/update/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name, phone } = body;

    if (!id) return new NextResponse("User ID required", { status: 400 });

    const updatedUser = await db.user.update({
      where: { id },
      data: { name, phone },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("USER_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}