import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const alerts = await db.notification.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(alerts);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}