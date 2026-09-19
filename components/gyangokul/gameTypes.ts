export type Language = "en" | "hi" | "or";

export type Gender = "boy" | "girl";

export type ClassLevel =
  | "KG1"
  | "KG2"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10";

export type Subject = "random" | string;

export interface GameSettings {
  language: Language;
  classLevel: ClassLevel;
  gender: Gender;
  subject: Subject;
}