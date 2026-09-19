import type {
  ClassLevel,
  Language,
  Subject,
} from "./gameTypes";

export type QuestionSource = "dynamic" | "r2";

export interface QuizQuestion {
  id: string;
  classLevel: ClassLevel;
  language: Language;
  subject: Subject;
  source: QuestionSource;
  question: string;
  options: string[];
  correctIndex: number;
  questionKey?: string;
}