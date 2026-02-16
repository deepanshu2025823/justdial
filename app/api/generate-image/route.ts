// app/api/generate-image/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!prompt) return new NextResponse("Prompt is required", { status: 400 });

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Professional prompt for: ${prompt}. Descriptive only.` }] }]
        })
      }
    );

    const geminiData = await geminiResponse.json();
    const optimizedPrompt = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || prompt;

    const seed = Math.floor(Math.random() * 999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(optimizedPrompt)}?width=1024&height=720&model=flux&seed=${seed}&nologo=true`;

    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
        return NextResponse.json({ 
            url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000", 
            warning: "AI Busy, showing placeholder" 
        });
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({ url: dataUrl });

  } catch (error) {
    console.error("GEN_ERROR:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}