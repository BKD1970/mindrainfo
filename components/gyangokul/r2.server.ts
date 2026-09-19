import {
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import type {
  ClassLevel,
  Language,
} from "./gameTypes";

import type {
  QuizQuestion,
} from "./questionTypes";

type R2Manifest = {
  version: number;
  classLevel: ClassLevel;
  language: Language;
  subjects: Record<string, string[]>;
};

const manifestCache = new Map<
  string,
  {
    expiresAt: number;
    manifest: R2Manifest;
  }
>();

const chunkCache = new Map<
  string,
  {
    expiresAt: number;
    questions: QuizQuestion[];
  }
>();

const CACHE_TTL_MS = 60_000;

function getRequiredEnv(
  name: string
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}`
    );
  }

  return value;
}

export function hasR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY
  );
}

function getR2Client(): S3Client {
  const accountId =
    getRequiredEnv("R2_ACCOUNT_ID");

  const accessKeyId =
    getRequiredEnv("R2_ACCESS_KEY_ID");

  const secretAccessKey =
    getRequiredEnv(
      "R2_SECRET_ACCESS_KEY"
    );

  return new S3Client({
    region: "auto",

    endpoint:
      `https://${accountId}.r2.cloudflarestorage.com`,

    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

async function readR2Object(
  key: string
): Promise<string> {
  const bucketName =
    getRequiredEnv("R2_BUCKET_NAME");

  const client = getR2Client();

  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error(
      `R2 object has no body: ${key}`
    );
  }

  return response.Body.transformToString();
}

function normalizeSubject(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeQuestion(
  raw: unknown,
  classLevel: ClassLevel,
  language: Language,
  fallbackSubject: string
): QuizQuestion | null {
  if (
    typeof raw !== "object" ||
    raw === null
  ) {
    return null;
  }

  const item =
    raw as Record<string, unknown>;

  const id =
    typeof item.id === "string"
      ? item.id.trim()
      : "";

  const question =
    typeof item.question === "string"
      ? item.question.trim()
      : "";

  const subject =
    typeof item.subject === "string" &&
    item.subject.trim()
      ? normalizeSubject(item.subject)
      : normalizeSubject(
          fallbackSubject
        );

  const options =
    Array.isArray(item.options)
      ? item.options.filter(
          (
            option
          ): option is string =>
            typeof option === "string"
        )
      : [];

  const correctIndex =
    typeof item.correctIndex === "number"
      ? item.correctIndex
      : -1;

  if (!id) {
    return null;
  }

  if (!question) {
    return null;
  }

  if (options.length < 2) {
    return null;
  }

  if (
    correctIndex < 0 ||
    correctIndex >= options.length
  ) {
    return null;
  }

  return {
    id,
    classLevel,
    language,
    subject,
    source: "r2",
    question,
    options,
    correctIndex,
  };
}

export async function loadR2Manifest(
  classLevel: ClassLevel,
  language: Language
): Promise<R2Manifest | null> {
  if (!hasR2Configured()) {
    return null;
  }

  const classPath =
    classLevel === "KG1" ||
    classLevel === "KG2"
      ? classLevel.toLowerCase()
      : `class-${classLevel}`;

  const key =
    `manifests/${classPath}/${language}.json`;

  const cached =
    manifestCache.get(key);

  if (
    cached &&
    cached.expiresAt > Date.now()
  ) {
    return cached.manifest;
  }

  try {
    const text =
      await readR2Object(key);

    const parsed =
      JSON.parse(text) as R2Manifest;

    if (
      typeof parsed !== "object" ||
      parsed === null
    ) {
      throw new Error(
        "Invalid R2 manifest."
      );
    }

    if (
      !parsed.subjects ||
      typeof parsed.subjects !==
        "object"
    ) {
      throw new Error(
        "R2 manifest has no subjects."
      );
    }

    const manifest: R2Manifest = {
      version:
        typeof parsed.version ===
        "number"
          ? parsed.version
          : 1,

      classLevel,

      language,

      subjects:
        parsed.subjects,
    };

    manifestCache.set(key, {
      expiresAt:
        Date.now() + CACHE_TTL_MS,
      manifest,
    });

    return manifest;
  } catch (error) {
    console.error(
      `Unable to load R2 manifest: ${key}`,
      error
    );

    return null;
  }
}

export async function loadR2QuestionsFromChunk(
  key: string,
  classLevel: ClassLevel,
  language: Language,
  fallbackSubject: string
): Promise<QuizQuestion[]> {
  if (!hasR2Configured()) {
    return [];
  }

  const cached =
    chunkCache.get(key);

  if (
    cached &&
    cached.expiresAt > Date.now()
  ) {
    return cached.questions;
  }

  try {
    const text =
      await readR2Object(key);

    const parsed =
      JSON.parse(text);

    if (!Array.isArray(parsed)) {
      throw new Error(
        `R2 question chunk must be an array: ${key}`
      );
    }

    const questions =
      parsed
        .map((item) =>
          normalizeQuestion(
            item,
            classLevel,
            language,
            fallbackSubject
          )
        )
        .filter(
          (
            question
          ): question is QuizQuestion =>
            question !== null
        );

    chunkCache.set(key, {
      expiresAt:
        Date.now() + CACHE_TTL_MS,
      questions,
    });

    return questions;
  } catch (error) {
    console.error(
      `Unable to load R2 question chunk: ${key}`,
      error
    );

    return [];
  }
}