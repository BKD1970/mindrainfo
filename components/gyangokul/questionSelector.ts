import type {
  GameSettings,
} from "./gameTypes";

import type {
  QuizQuestion,
} from "./questionTypes";

interface CreateQuizSessionParams
  extends Pick<
    GameSettings,
    "classLevel" | "language" | "subject"
  > {
  studentId: string;
  sessionNumber: number;
}

export async function createQuizSession(
  params: CreateQuizSessionParams
): Promise<QuizQuestion[]> {
  const response = await fetch(
    "/api/gyangokul/quiz",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(params),
    }
  );

  let data: {
    questions?: QuizQuestion[];
    error?: string;
  };

  try {
    data =
      (await response.json()) as {
        questions?: QuizQuestion[];
        error?: string;
      };
  } catch {
    throw new Error(
      "The quiz server returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Unable to create the quiz."
    );
  }

  if (
    !Array.isArray(data.questions)
  ) {
    throw new Error(
      "The quiz server did not return questions."
    );
  }

  if (data.questions.length !== 10) {
    throw new Error(
      "Exactly 10 questions were not returned."
    );
  }

  return data.questions;
}

export function clearUsedQuestionHistory(): void {
  /*
   * Permanent question history is now stored
   * server-side in Cloudflare D1.
   *
   * This function remains only for compatibility
   * with any older code that may import it.
   *
   * We intentionally do not remove D1 history
   * from the browser.
   */
}