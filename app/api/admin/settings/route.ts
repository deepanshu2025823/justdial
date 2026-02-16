// app/api/admin/settings/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    let settings = await db.siteSettings.findUnique({ 
        where: { id: "global-config" } 
    });

    if (!settings) {
      settings = await db.siteSettings.create({ 
        data: { 
            id: "global-config",
            siteName: "JustDial Clone",
            supportEmail: "admin@justdial.com",
            maintenanceMode: false,
            aiModel: "Imagen-3-Turbo"
        } 
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET_SETTINGS_ERROR", error);
    return new NextResponse("Internal Database Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    const { siteName, supportEmail, maintenanceMode, aiModel } = body;

    const updated = await db.siteSettings.update({
      where: { id: "global-config" },
      data: {
        siteName,
        supportEmail,
        maintenanceMode,
        aiModel
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH_SETTINGS_ERROR", error);
    return new NextResponse("Update Failed", { status: 500 });
  }
}