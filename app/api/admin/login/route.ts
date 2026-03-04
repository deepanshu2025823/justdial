// app/api/admin/login/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password, otp } = body;
    const cookieStore = await cookies();

    if (action === "send-otp") {
      const user = await db.user.findUnique({ where: { email } });

      if (!user || user.role !== "ADMIN" || user.password !== password) {
        return new NextResponse("Access Denied", { status: 401 });
      }

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      cookieStore.set("temp_otp", generatedOtp, { 
        httpOnly: true, 
        secure: true, 
        maxAge: 300, 
        path: "/" 
      });

      await transporter.sendMail({
        from: `"JustDial Security" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Admin Access Verification",
        html: `<div style="font-family: sans-serif; padding: 20px; text-align: center;">
            <h2 style="color: #0073c1;">JustDial Admin</h2>
            <p>Use the code below to access your dashboard:</p>
            <h1 style="letter-spacing: 5px; background: #eee; padding: 15px; display: inline-block; border-radius: 8px;">${generatedOtp}</h1>
            <p>Code expires in 5 minutes.</p>
          </div>`,
      });

      return NextResponse.json({ success: true });
    }

    if (action === "verify-otp") {
      const storedOtp = cookieStore.get("temp_otp")?.value;

      if (!storedOtp || storedOtp !== otp) {
        return new NextResponse("Invalid OTP", { status: 400 });
      }

      cookieStore.delete("temp_otp");

      cookieStore.set("admin_token", "secure-admin-access-token", {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "lax"
      });

      return NextResponse.json({ success: true });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}