// src/app/api/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import { reviewCode, DEFAULT_MODEL } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60; // Vercel: allow up to 60s for AI response

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language, model } = body;

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: "No code provided." },
        { status: 400 }
      );
    }

    if (code.length > 50_000) {
      return NextResponse.json(
        { error: "Code too long. Please keep it under 50,000 characters." },
        { status: 400 }
      );
    }

    const result = await reviewCode({
      code: code.trim(),
      language: language ?? undefined,
      model: model ?? DEFAULT_MODEL,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("[/api/review]", err);
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
