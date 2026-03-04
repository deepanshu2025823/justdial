// app/api/enquiries/[id]/route.ts

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;
    
    const body = await req.json();
    const { status, reply } = body;

    const updatedEnquiry = await db.enquiry.update({
      where: { id: id }, 
      data: { 
        status, 
        message: reply ? `REPLY: ${reply}` : undefined 
      }, 
    });

    return NextResponse.json(updatedEnquiry);
  } catch (error) {
    console.error("[ENQUIRY_PATCH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}