// app/api/admin/login/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";

const otpStore = new Map<string, string>();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password, otp } = body;

    if (action === "send-otp") {
      
      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user || user.role !== "ADMIN" || user.password !== password) {
        return new NextResponse("Access Denied: Invalid Credentials or Not an Admin", { status: 401 });
      }

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(email, generatedOtp);
      console.log(`Generated OTP for ${email}: ${generatedOtp}`);

      await transporter.sendMail({
        from: `"JustDial Security" <${process.env.SMTP_USER}>`,
        to: email, 
        subject: "Admin Access Verification",
        html: `
          <div style="font-family: sans-serif; padding: 20px; text-align: center;">
            <h2 style="color: #0073c1;">JustDial Admin</h2>
            <p>Use the code below to access your dashboard:</p>
            <h1 style="letter-spacing: 5px; background: #eee; padding: 15px; display: inline-block; border-radius: 8px;">${generatedOtp}</h1>
            <p>Code expires in 5 minutes.</p>
          </div>
        `,
      });

      return NextResponse.json({ success: true, message: "OTP sent to your email" });
    }

    if (action === "verify-otp") {
      const storedOtp = otpStore.get(email);

      if (!storedOtp || storedOtp !== otp) {
        return new NextResponse("Invalid or expired OTP", { status: 400 });
      }

      otpStore.delete(email);

      const cookieStore = await cookies();
      cookieStore.set("admin_token", "secure-admin-access-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, 
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("Login Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}