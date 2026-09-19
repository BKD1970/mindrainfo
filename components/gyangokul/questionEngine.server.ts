import type {
  ClassLevel,
  Language,
  Subject,
} from "./gameTypes";

import type {
  QuizQuestion,
} from "./questionTypes";

import {
  createQuestionKey,
} from "./dedupe";

import {
  loadR2Manifest,
  loadR2QuestionsFromChunk,
} from "./r2.server";

import {
  generateDynamicQuestionCandidates,
  getDynamicSubjects,
} from "./dynamicGenerators.server";

import {
  reserveQuestions,
} from "./d1.server";

export const SESSION_SIZE = 10;

const MAX_RESERVATION_ROUNDS = 20;
const MAX_R2_CHUNKS_PER_ROUND = 12;
const MAX_R2_CHUNKS_PER_SUBJECT = 8;

const DYNAMIC_CANDIDATES_PER_ROUND = 300;
const RESERVATION_BATCH_SIZE = SESSION_SIZE;

type QuizQuestionWithKey =
  QuizQuestion & {
    questionKey: string;
  };

/*
 * ============================================================
 * BASIC HELPERS
 * ============================================================
 */

function uniqueById(
  questions: QuizQuestion[]
): QuizQuestion[] {
  const seen = new Set<string>();
  const result: QuizQuestion[] = [];

  for (const question of questions) {
    if (seen.has(question.id)) {
      continue;
    }

    seen.add(question.id);
    result.push(question);
  }

  return result;
}

function addQuestionKey(
  question: QuizQuestion
): QuizQuestionWithKey {
  return {
    ...question,
    questionKey: createQuestionKey({
      question: question.question,
      options: question.options,
      correctIndex: question.correctIndex,
    }),
  };
}

function uniqueByQuestionKey(
  questions: QuizQuestionWithKey[]
): QuizQuestionWithKey[] {
  const seen = new Set<string>();
  const result: QuizQuestionWithKey[] = [];

  for (const question of questions) {
    if (seen.has(question.questionKey)) {
      continue;
    }

    seen.add(question.questionKey);
    result.push(question);
  }

  return result;
}

function shuffleArray<T>(
  items: T[]
): T[] {
  const result = [...items];

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      result[i],
      result[j],
    ] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

function randomItems<T>(
  items: T[],
  maxCount: number
): T[] {
  return shuffleArray(items).slice(
    0,
    maxCount
  );
}

function normalizeSubject(
  subject: string
): string {
  return subject
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/*
 * ============================================================
 * R2 CANDIDATES
 * ============================================================
 */

async function loadR2Candidates(
  classLevel: ClassLevel,
  language: Language,
  requestedSubject: Subject
): Promise<QuizQuestion[]> {
  const manifest =
    await loadR2Manifest(
      classLevel,
      language
    );

  if (!manifest) {
    return [];
  }

  const availableSubjects =
    Object.keys(
      manifest.subjects ?? {}
    );

  let subjectsToUse: string[];

  if (
    requestedSubject !== "random"
  ) {
    const normalized =
      normalizeSubject(
        String(requestedSubject)
      );

    const matchedSubject =
      availableSubjects.find(
        (subject) =>
          normalizeSubject(
            subject
          ) === normalized
      );

    if (!matchedSubject) {
      return [];
    }

    subjectsToUse = [
      matchedSubject,
    ];
  } else {
    subjectsToUse =
      randomItems(
        availableSubjects,
        6
      );
  }

  const chunkJobs: Array<{
    key: string;
    subject: string;
  }> = [];

  for (
    const subject of subjectsToUse
  ) {
    const chunks =
      Array.isArray(
        manifest.subjects[subject]
      )
        ? manifest.subjects[subject]
        : [];

    const selectedChunks =
      randomItems(
        chunks,
        Math.min(
          chunks.length,
          MAX_R2_CHUNKS_PER_SUBJECT
        )
      );

    for (
      const key of selectedChunks
    ) {
      chunkJobs.push({
        key,
        subject,
      });
    }
  }

  const selectedJobs =
    randomItems(
      chunkJobs,
      MAX_R2_CHUNKS_PER_ROUND
    );

  const loaded =
    await Promise.all(
      selectedJobs.map(
        async ({
          key,
          subject,
        }) =>
          loadR2QuestionsFromChunk(
            key,
            classLevel,
            language,
            subject
          )
      )
    );

  return loaded.flat();
}

/*
 * ============================================================
 * SUBJECT FILTER
 * ============================================================
 */

function filterForSubject(
  questions: QuizQuestion[],
  subject: Subject
): QuizQuestion[] {
  if (subject === "random") {
    return questions;
  }

  const wanted =
    normalizeSubject(
      String(subject)
    );

  return questions.filter(
    (question) =>
      normalizeSubject(
        String(question.subject)
      ) === wanted
  );
}

/*
 * ============================================================
 * AVAILABLE SUBJECTS
 * ============================================================
 */

export async function getAvailableSubjects(
  classLevel: ClassLevel,
  language: Language
): Promise<Subject[]> {
  const subjects =
    new Set<string>();

  for (
    const subject of
      getDynamicSubjects()
  ) {
    subjects.add(
      normalizeSubject(
        String(subject)
      )
    );
  }

  const manifest =
    await loadR2Manifest(
      classLevel,
      language
    );

  if (manifest) {
    for (
      const subject of Object.keys(
        manifest.subjects ?? {}
      )
    ) {
      subjects.add(
        normalizeSubject(
          subject
        )
      );
    }
  }

  return [
    "random",
    ...Array.from(
      subjects
    ).sort(),
  ];
}

/*
 * ============================================================
 * CREATE QUIZ SESSION
 * ============================================================
 */

export async function createQuizSessionServer(
  params: {
    studentId: string;
    classLevel: ClassLevel;
    language: Language;
    subject: Subject;
    sessionNumber: number;
  }
): Promise<QuizQuestion[]> {
  const {
    studentId,
    classLevel,
    language,
    subject,
    sessionNumber,
  } = params;

  if (!studentId) {
    throw new Error(
      "Student ID is required."
    );
  }

  for (
    let round = 0;
    round < MAX_RESERVATION_ROUNDS;
    round++
  ) {
    const candidates:
      QuizQuestion[] = [];

    /*
     * ----------------------------------------------------------
     * R2 QUESTIONS
     * ----------------------------------------------------------
     */

    const r2Questions =
      await loadR2Candidates(
        classLevel,
        language,
        subject
      );

    candidates.push(
      ...r2Questions
    );

    /*
     * ----------------------------------------------------------
     * DYNAMIC QUESTIONS
     * ----------------------------------------------------------
     */

    const dynamicQuestions =
      generateDynamicQuestionCandidates(
        classLevel,
        language,
        DYNAMIC_CANDIDATES_PER_ROUND,
        subject
      );

    candidates.push(
      ...dynamicQuestions
    );

    /*
     * ----------------------------------------------------------
     * SUBJECT FILTER
     * ----------------------------------------------------------
     */

    const eligibleQuestions =
      filterForSubject(
        uniqueById(
          candidates
        ),
        subject
      );

    if (
      eligibleQuestions.length === 0
    ) {
      throw new Error(
        `No questions are available for subject "${subject}".`
      );
    }

    /*
     * ----------------------------------------------------------
     * CREATE QUESTION KEYS
     * ----------------------------------------------------------
     */

    const keyedQuestions =
      eligibleQuestions.map(
        addQuestionKey
      );

    /*
     * Remove duplicate question
     * CONTENT before talking to D1.
     *
     * This is important because two
     * different IDs can still represent
     * the same question content.
     */

    const uniqueKeyedQuestions =
      uniqueByQuestionKey(
        keyedQuestions
      );

    /*
     * ----------------------------------------------------------
     * RANDOMIZE
     * ----------------------------------------------------------
     */

    const shuffledCandidates =
      shuffleArray(
        uniqueKeyedQuestions
      );

    /*
     * ----------------------------------------------------------
     * IMPORTANT:
     *
     * DO NOT send all candidates to D1.
     *
     * DO NOT send only the first 10
     * and immediately fail.
     *
     * Instead, process candidates in
     * 10-question batches.
     *
     * D1 reserves only genuinely new
     * questions.
     *
     * If a batch produces fewer than 10
     * fresh questions, continue with the
     * next batch.
     * ----------------------------------------------------------
     */

    const reserved:
      QuizQuestionWithKey[] = [];

    for (
      let start = 0;
      start <
        shuffledCandidates.length;
      start +=
        RESERVATION_BATCH_SIZE
    ) {
      const remaining =
        SESSION_SIZE -
        reserved.length;

      if (
        remaining <= 0
      ) {
        break;
      }

      /*
       * Never reserve more than the
       * number still required.
       */

      const batch =
        shuffledCandidates.slice(
          start,
          start +
            Math.min(
              RESERVATION_BATCH_SIZE,
              remaining
            )
        );

      if (
        batch.length === 0
      ) {
        break;
      }

      const reservedBatch =
        await reserveQuestions(
          studentId,
          batch,
          sessionNumber
        );

      reserved.push(
        ...reservedBatch
      );

      /*
       * We have exactly 10 fresh
       * questions. Return immediately.
       */

      if (
        reserved.length ===
        SESSION_SIZE
      ) {
        return shuffleArray(
          reserved.slice(
            0,
            SESSION_SIZE
          )
        );
      }
    }

    /*
     * ----------------------------------------------------------
     * Not enough fresh questions in
     * this round.
     *
     * Generate/load a completely new
     * candidate pool in the next round.
     * ----------------------------------------------------------
     */
  }

  throw new Error(
    "Unable to create 10 fresh questions. " +
      "The available unused question pool may be exhausted."
  );
}