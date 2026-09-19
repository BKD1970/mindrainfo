import type { ClassLevel, Language } from "./gameTypes";
import type { QuizQuestion } from "./questionTypes";

const R2_BASE_URL =
  process.env.NEXT_PUBLIC_GYAN_GOKUL_QUESTION_BASE_URL || "";

function getClassPath(classLevel: ClassLevel): string {
  if (classLevel === "KG1") return "kg1";
  if (classLevel === "KG2") return "kg2";

  return `class${classLevel}`;
}

export async function loadR2QuestionChunk(
  classLevel: ClassLevel,
  language: Language,
  chunk = "001"
): Promise<QuizQuestion[]> {
  if (!R2_BASE_URL) {
    return [];
  }

  const classPath = getClassPath(classLevel);

  const url =
    `${R2_BASE_URL}/${classPath}/${language}/${chunk}.json`;

  try {
    const response = await fetch(url, {
      cache: "force-cache",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data as QuizQuestion[];
  } catch (error) {
    console.error("Unable to load R2 questions:", error);

    return [];
  }
}