"use client";

const STUDENT_ID_KEY =
  "gyangokul-anonymous-student-id-v1";

function createStudentId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `student-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export function getOrCreateStudentId(): string {
  if (typeof window === "undefined") {
    throw new Error(
      "Student ID can only be created in the browser."
    );
  }

  try {
    const existingId =
      localStorage.getItem(STUDENT_ID_KEY);

    if (existingId) {
      return existingId;
    }

    const newStudentId = createStudentId();

    localStorage.setItem(
      STUDENT_ID_KEY,
      newStudentId
    );

    return newStudentId;
  } catch {
    return createStudentId();
  }
}