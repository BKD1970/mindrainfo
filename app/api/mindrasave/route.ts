import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { url, format } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid media URL is required." },
        { status: 400 }
      );
    }

    if (!["mp4", "mp3"].includes(format)) {
      return NextResponse.json(
        { error: "Format must be mp4 or mp3." },
        { status: 400 }
      );
    }

    const backendUrl = process.env.MINDRASAVE_API_URL;

    if (!backendUrl) {
      console.error("MINDRASAVE_API_URL is not configured.");

      return NextResponse.json(
        { error: "MindraSave is temporarily unavailable." },
        { status: 500 }
      );
    }

    const response = await fetch(`${backendUrl}/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url.trim(),
        format,
      }),
    });

    if (!response.ok) {
      let message = "The media could not be downloaded.";

      try {
        const data = await response.json();

        if (data?.error) {
          message = data.error;
        }
      } catch {
        // Keep default message.
      }

      return NextResponse.json(
        { error: message },
        { status: response.status }
      );
    }

    const file = await response.arrayBuffer();

    const contentType =
      response.headers.get("Content-Type") ||
      (format === "mp4" ? "video/mp4" : "audio/mpeg");

    const contentDisposition =
      response.headers.get("Content-Disposition") ||
      `attachment; filename="mindrasave-${format}.${format}"`;

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("MindraSave API error:", error);

    return NextResponse.json(
      {
        error:
          "Unable to process your download right now. Please try again.",
      },
      { status: 500 }
    );
  }
}