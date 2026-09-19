import { NextResponse } from "next/server";

import type {
  ClassLevel,
  Language,
  Subject,
} from "@/components/gyangokul/gameTypes";

import {
  createQuizSessionServer,
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

function isValidStudentId(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    value.length >= 10 &&
    value.length <= 100
  );
}

function isValidClassLevel(
  value: unknown
): value is ClassLevel {
  return (
    typeof value === "string" &&
    VALID_CLASSES.includes(
      value as ClassLevel
    )
  );
}

function isValidLanguage(
  value: unknown
): value is Language {
  return (
    typeof value === "string" &&
    VALID_LANGUAGES.includes(
      value as Language
    )
  );
}

function isValidSubject(
  value: unknown
): value is Subject {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= 100
  );
}

function isValidSessionNumber(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1
  );
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as Record<
        string,
        unknown
      >;

    const {
      studentId,
      classLevel,
      language,
      subject,
      sessionNumber,
    } = body;

    if (!isValidStudentId(studentId)) {
      return NextResponse.json(
        {
          error:
            "Invalid student ID.",
        },
        { status: 400 }
      );
    }

    if (!isValidClassLevel(classLevel)) {
      return NextResponse.json(
        {
          error:
            "Invalid class level.",
        },
        { status: 400 }
      );
    }

    if (!isValidLanguage(language)) {
      return NextResponse.json(
        {
          error:
            "Invalid language.",
        },
        { status: 400 }
      );
    }

    if (!isValidSubject(subject)) {
      return NextResponse.json(
        {
          error:
            "Invalid subject.",
        },
        { status: 400 }
      );
    }

    if (
      !isValidSessionNumber(
        sessionNumber
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid session number.",
        },
        { status: 400 }
      );
    }

    const questions =
      await createQuizSessionServer({
        studentId,
        classLevel,
        language,
        subject,
        sessionNumber,
      });

    return NextResponse.json(
      {
        questions,
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
      "GyanGokul quiz API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create quiz.",
      },
      { status: 500 }
    );
  }
}