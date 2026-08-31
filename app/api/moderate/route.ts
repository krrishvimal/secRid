import { NextRequest, NextResponse } from "next/server";
import { evaluateSafety } from "@/lib/safety";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { passed: false, errorReason: "Missing text payload" },
        { status: 400 }
      );
    }

    // Run core evaluation
    const safetyResult = evaluateSafety(text);

    return NextResponse.json(safetyResult, { status: 200 });
  } catch (error) {
    console.error("Moderation API Error:", error);
    return NextResponse.json(
      { passed: false, errorReason: "Internal moderation error" },
      { status: 500 }
    );
  }
}
