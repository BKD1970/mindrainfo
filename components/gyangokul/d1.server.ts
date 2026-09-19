import type { QuizQuestion } from "./questionTypes";

const CLOUDFLARE_API_BASE =
  "https://api.cloudflare.com/client/v4";

type QuizQuestionWithKey = QuizQuestion & {
  questionKey: string;
};

type D1QueryResult = {
  success: boolean;
  errors?: Array<{
    code: number;
    message: string;
  }>;
  result?: Array<{
    success: boolean;
    results?: Record<string, unknown>[];
    meta?: {
      changes?: number;
    };
  }>;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}`
    );
  }

  return value;
}

async function d1Query(
  sql: string,
  params: unknown[] = []
): Promise<D1QueryResult> {
  const accountId = getRequiredEnv(
    "CLOUDFLARE_ACCOUNT_ID"
  );

  const databaseId = getRequiredEnv(
    "CLOUDFLARE_D1_DATABASE_ID"
  );

  const apiToken = getRequiredEnv(
    "CLOUDFLARE_API_TOKEN"
  );

  const response = await fetch(
    `${CLOUDFLARE_API_BASE}/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        sql,
        params,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `D1 request failed (${response.status}): ${text}`
    );
  }

  const data =
    (await response.json()) as D1QueryResult;

  if (!data.success) {
    throw new Error(
      data.errors
        ?.map((error) => error.message)
        .join("; ") ||
        "D1 query failed."
    );
  }

  return data;
}

export async function touchStudent(
  studentId: string
): Promise<void> {
  await d1Query(
    `
      INSERT INTO students (
        student_id
      )
      VALUES (?)
      ON CONFLICT(student_id)
      DO UPDATE SET
        last_seen_at = datetime('now')
    `,
    [studentId]
  );
}

export async function reserveQuestions(
  studentId: string,
  questions: QuizQuestionWithKey[],
  sessionNumber: number
): Promise<QuizQuestionWithKey[]> {
  if (questions.length === 0) {
    return [];
  }

  await touchStudent(studentId);

  const statements = questions.map(
    (question) => ({
      sql: `
        INSERT OR IGNORE INTO served_questions (
          student_id,
          question_id,
          question_key,
          class_level,
          language,
          subject,
          source,
          session_number
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params: [
        studentId,
        question.id,
        question.questionKey,
        question.classLevel,
        question.language,
        question.subject,
        question.source,
        sessionNumber,
      ],
    })
  );

  const accountId = getRequiredEnv(
    "CLOUDFLARE_ACCOUNT_ID"
  );

  const databaseId = getRequiredEnv(
    "CLOUDFLARE_D1_DATABASE_ID"
  );

  const apiToken = getRequiredEnv(
    "CLOUDFLARE_API_TOKEN"
  );

  const response = await fetch(
    `${CLOUDFLARE_API_BASE}/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        batch: statements,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `D1 batch request failed (${response.status}): ${text}`
    );
  }

  const data =
    (await response.json()) as D1QueryResult;

  if (!data.success) {
    throw new Error(
      data.errors
        ?.map((error) => error.message)
        .join("; ") ||
        "D1 batch query failed."
    );
  }

  const results = data.result ?? [];

  const reserved: QuizQuestionWithKey[] = [];

  questions.forEach((question, index) => {
    const changes =
      results[index]?.meta?.changes ?? 0;

    if (changes > 0) {
      reserved.push(question);
    }
  });

  return reserved;
}