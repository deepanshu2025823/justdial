// app/api/enquiries/[id]/route.ts

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, reply } = body;

    const updatedEnquiry = await db.enquiry.update({
      where: { id: params.id },
      data: { status, message: `REPLY: ${reply}` }, 
    });

    return NextResponse.json(updatedEnquiry);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}