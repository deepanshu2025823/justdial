// app/api/enquiries/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, mobile, message, businessId, userId } = body;

    const enquiry = await db.enquiry.create({
      data: {
        name,
        mobile,
        message,
        businessId,
        userId: userId || undefined, 
        status: "PENDING"
      }
    });

    return NextResponse.json(enquiry);
  } catch (error) {
    return new NextResponse("Error creating enquiry", { status: 500 });
  }
}