import type { ClassLevel, Language } from "../gameTypes";
import type { QuizQuestion } from "../questionTypes";

function classNumber(classLevel: ClassLevel): number {
  if (classLevel === "KG1") return 0;
  if (classLevel === "KG2") return 0;

  return Number(classLevel);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function makeOptions(answer: number): {
  options: string[];
  correctIndex: number;
} {
  const values = new Set<number>();

  values.add(answer);

  while (values.size < 4) {
    const offset = randomInt(-10, 10);

    if (offset !== 0) {
      values.add(answer + offset);
    }
  }

  const shuffled = shuffle(Array.from(values));
  const correctIndex = shuffled.indexOf(answer);

  return {
    options: shuffled.map(String),
    correctIndex,
  };
}

function getRange(level: number) {
  if (level <= 1) {
    return { min: 1, max: 10 };
  }

  if (level === 2) {
    return { min: 1, max: 20 };
  }

  if (level <= 4) {
    return { min: 1, max: 100 };
  }

  if (level <= 6) {
    return { min: 10, max: 500 };
  }

  if (level <= 8) {
    return { min: 10, max: 1000 };
  }

  return { min: 20, max: 5000 };
}

function getOperator(level: number): "+" | "-" | "×" | "÷" {
  if (level <= 2) {
    return Math.random() < 0.5 ? "+" : "-";
  }

  if (level <= 5) {
    const operators: Array<"+" | "-" | "×"> = [
      "+",
      "-",
      "×",
    ];

    return operators[randomInt(0, operators.length - 1)];
  }

  const operators: Array<"+" | "-" | "×" | "÷"> = [
    "+",
    "-",
    "×",
    "÷",
  ];

  return operators[randomInt(0, operators.length - 1)];
}

function buildQuestionText(
  language: Language,
  a: number,
  b: number,
  operator: string
): string {
  if (language === "hi") {
    return `${a} ${operator} ${b} कितना है?`;
  }

  if (language === "or") {
    return `${a} ${operator} ${b} କେତେ ହୁଏ?`;
  }

  return `What is ${a} ${operator} ${b}?`;
}

export function generateMathQuestion(
  classLevel: ClassLevel,
  language: Language
): QuizQuestion {
  const level = classNumber(classLevel);
  const { min, max } = getRange(level);

  const operator = getOperator(level);

  let a = randomInt(min, max);
  let b = randomInt(min, max);
  let answer: number;

  switch (operator) {
    case "+":
      answer = a + b;
      break;

    case "-":
      if (b > a) {
        [a, b] = [b, a];
      }

      answer = a - b;
      break;

    case "×":
      if (level <= 5) {
        a = randomInt(1, Math.min(20, max));
        b = randomInt(1, Math.min(10, max));
      }

      answer = a * b;
      break;

    case "÷": {
      b = randomInt(2, Math.min(20, max));

      const quotient = randomInt(2, Math.min(50, max));

      a = b * quotient;
      answer = quotient;

      break;
    }

    default:
      answer = a + b;
  }

  const { options, correctIndex } = makeOptions(answer);

  const id = `math-${classLevel}-${a}-${operator}-${b}`;

  return {
    id,
    classLevel,
    language,
    subject: "Mathematics",
    source: "dynamic",
    question: buildQuestionText(
      language,
      a,
      b,
      operator
    ),
    options,
    correctIndex,
  };
}