import { createHash } from "crypto";

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function createQuestionKey(input: {
  question: string;
  options: string[];
  correctIndex: number;
}): string {
  const normalizedQuestion = normalizeText(
    input.question
  );

  const normalizedOptions = input.options
    .map(normalizeText)
    .sort();

  const correctAnswer = normalizeText(
    input.options[input.correctIndex] ?? ""
  );

  const payload = JSON.stringify({
    question: normalizedQuestion,
    options: normalizedOptions,
    correctAnswer,
  });

  return createHash("sha256")
    .update(payload)
    .digest("hex");
}