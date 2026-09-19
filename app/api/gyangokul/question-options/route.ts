import { NextResponse } from "next/server";

import type {
  ClassLevel,
  Language,
} from "@/components/gyangokul/gameTypes";

import {
  getAvailableSubjects,
} from "@/components/gyangokul/questionEngine.server";

export const runtime = "nodejs";

const VALID_LANGUAGES: Language[] = [
  "en",
  "hi",
  "or",
];

const VALID_CLASSES: ClassLevel[] = [
  "KG1",
  "KG2",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
];

function isValidClassLevel(
  value: string | null
): value is ClassLevel {
  return (
    value !== null &&
    VALID_CLASSES.includes(
      value as ClassLevel
    )
  );
}

function isValidLanguage(
  value: string | null
): value is Language {
  return (
    value !== null &&
    VALID_LANGUAGES.includes(
      value as Language
    )
  );
}

export async function GET(
  request: Request
) {
  try {
    const url =
      new URL(request.url);

    const classLevel =
      url.searchParams.get(
        "classLevel"
      );

    const language =
      url.searchParams.get(
        "language"
      );

    if (
      !isValidClassLevel(
        classLevel
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid class level.",
        },
        { status: 400 }
      );
    }

    if (
      !isValidLanguage(
        language
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid language.",
        },
        { status: 400 }
      );
    }

    const subjects =
      await getAvailableSubjects(
        classLevel,
        language
      );

    return NextResponse.json(
      {
        subjects,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "GyanGokul question-options API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load question options.",
      },
      { status: 500 }
    );
  }
}