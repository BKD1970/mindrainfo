import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const input = body?.input;
    const sourceLanguageCode = body?.sourceLanguageCode;
    const targetLanguageCode = body?.targetLanguageCode;

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Please enter some text to translate." },
        { status: 400 }
      );
    }

    if (input.length > 2000) {
      return NextResponse.json(
        {
          error:
            "Please keep the text within 2000 characters for translation.",
        },
        { status: 400 }
      );
    }

    if (!sourceLanguageCode || !targetLanguageCode) {
      return NextResponse.json(
        { error: "Source and target languages are required." },
        { status: 400 }
      );
    }

    if (sourceLanguageCode === targetLanguageCode) {
      return NextResponse.json({
        translatedText: input,
        sourceLanguageCode,
      });
    }

    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      console.error("SARVAM_API_KEY is missing.");

      return NextResponse.json(
        {
          error:
            "Translator is not configured yet. Please add the Sarvam API key.",
        },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        input,
        source_language_code: sourceLanguageCode,
        target_language_code: targetLanguageCode,
        model: "sarvam-translate:v1",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Sarvam translation error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            data?.message ||
            "Translation failed. Please try again.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      translatedText: data.translated_text,
      sourceLanguageCode:
        data.source_language_code || sourceLanguageCode,
    });
  } catch (error) {
    console.error("Translation route error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while translating the text.",
      },
      { status: 500 }
    );
  }
}