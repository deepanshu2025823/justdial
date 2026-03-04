// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

const otpStore = new Map<string, { otp: string; expires: number }>();

export async function POST(req: Request) {
  try {
    const { email: identifier, action, otp: userOtp } = await req.json();

    if (!identifier) return new NextResponse("Identifier required", { status: 400 });

    const isEmail = identifier.includes("@");

    if (action === "SEND_OTP") {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(identifier, { otp: generatedOtp, expires: Date.now() + 300000 });

      console.log(`[AUTH] OTP for ${identifier} is: ${generatedOtp}`);

      if (isEmail) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: `"JustDial" <${process.env.SMTP_USER}>`,
            to: identifier,
            subject: "Your Login OTP for JustDial",
            html: `<div style="text-align:center; font-family:sans-serif; border:1px solid #eee; padding:20px;">
                    <h2 style="color:#0073c1;">Welcome to JustDial</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color:#0073c1; letter-spacing:5px;">${generatedOtp}</h1>
                   </div>`,
          });
        } catch (mailErr) {
          console.error("Mail Send Skip (Dev Mode):", mailErr);
        }
      } else {
        try {
          const smsRes = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=otp&variables_values=${generatedOtp}&numbers=${identifier}`);
          const smsData = await smsRes.json();
          
          if (!smsData.return) {
             console.log("SMS failed (Balance/Limit), use terminal OTP:", smsData.message);
          }
        } catch (smsErr) {
          console.error("SMS skip (Dev Mode):", smsErr);
        }
      }

      return NextResponse.json({ success: true, message: "OTP Sent (Check Terminal if SMS fails)" });
    }

    if (action === "VERIFY_OTP") {
      const record = otpStore.get(identifier);

      if (!record || record.otp !== userOtp || Date.now() > record.expires) {
        return new NextResponse("Invalid or Expired OTP", { status: 400 });
      }

      let user = await db.user.findFirst({
        where: isEmail ? { email: identifier } : { phone: identifier }
      });

      if (!user) {
        user = await db.user.create({
          data: {
            email: isEmail ? identifier : `${identifier}@justdial.com`,
            phone: isEmail ? null : identifier,
            role: "USER",
            password: "OAUTH_USER_JD"
          }
        });
      }

      otpStore.delete(identifier);
      return NextResponse.json({ success: true, user });
    }

    return new NextResponse("Invalid Action", { status: 400 });
  } catch (error: any) {
    console.error("AUTH_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}