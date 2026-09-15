import { QUESTION_BANK, type QuestionFact } from "./questionBank";

export type GeneratedQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  sourceFactId: string;
};

export type QuestionLanguage = "en" | "hi" | "or";

const PROMPTS: Record<QuestionLanguage, string[]> = {
  en: [
    "Which of the following is correctly associated with {subject}?",
    "According to Hindu traditions, which option is linked with {subject}?",
    "What is {subject} traditionally associated with?",
    "Choose the option that matches {subject}.",
    "Which statement best describes the traditional association of {subject}?",
    "In a traditional Hindu context, what is connected with {subject}?",
    "Which option correctly identifies {subject}?",
    "What role, idea, object or place is associated with {subject}?",
  ],
  hi: [
    "{subject} से परंपरागत रूप से क्या जुड़ा है?",
    "हिंदू परंपराओं के अनुसार {subject} के साथ क्या जोड़ा जाता है?",
    "{subject} से संबंधित सही विकल्प कौन-सा है?",
    "{subject} को किससे जोड़ा जाता है?",
    "कौन-सा विकल्प {subject} का सही पारंपरिक संबंध बताता है?",
    "परंपरागत हिंदू संदर्भ में {subject} से क्या संबंधित है?",
    "{subject} के बारे में सही विकल्प चुनिए।",
    "{subject} से जुड़ा विचार, भूमिका, वस्तु या स्थान कौन-सा है?",
  ],
  or: [
    "{subject} ସହ ପାରମ୍ପରିକ ଭାବେ କ'ଣ ଯୋଡ଼ାଯାଏ?",
    "ହିନ୍ଦୁ ପରମ୍ପରା ଅନୁସାରେ {subject} ସହ କେଉଁଟି ସମ୍ପର୍କିତ?",
    "{subject} ସମ୍ପର୍କିତ ସଠିକ ବିକଳ୍ପ କେଉଁଟି?",
    "{subject} କାହା ସହ ଯୋଡ଼ାଯାଏ?",
    "କେଉଁ ବିକଳ୍ପ {subject} ର ପାରମ୍ପରିକ ସମ୍ପର୍କକୁ ଠିକ ଭାବେ ଦର୍ଶାଏ?",
    "ପାରମ୍ପରିକ ହିନ୍ଦୁ ପରିପ୍ରେକ୍ଷିତରେ {subject} ସହ କ'ଣ ସମ୍ପର୍କିତ?",
    "{subject} ବିଷୟରେ ସଠିକ ବିକଳ୍ପ ବାଛନ୍ତୁ।",
    "{subject} ସହ ଜଡିତ ଧାରଣା, ଭୂମିକା, ବସ୍ତୁ ବା ସ୍ଥାନ କେଉଁଟି?",
  ],
};

const EXPLANATIONS: Record<
  QuestionLanguage,
  (fact: QuestionFact) => string
> = {
  en: (fact) => fact.fact,
  hi: (fact) => `परंपरा के अनुसार: ${fact.fact}`,
  or: (fact) => `ପରମ୍ପରା ଅନୁସାରେ: ${fact.fact}`,
};

function hashString(seed: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  hash += hash << 13;
  hash ^= hash >>> 7;
  hash += hash << 3;
  hash ^= hash >>> 17;
  hash += hash << 5;

  return hash >>> 0;
}

function seededIndex(seed: string, length: number): number {
  if (length <= 0) return 0;
  return hashString(seed) % length;
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index--) {
    const swapIndex = hashString(`${seed}:${index}`) % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function buildQuestion(
  fact: QuestionFact,
  variant: number,
  language: QuestionLanguage
): GeneratedQuestion {
  const templates = PROMPTS[language];

  const template =
    templates[
      seededIndex(`${fact.id}:template:${variant}`, templates.length)
    ];

  const question = template.replace("{subject}", fact.subject);

  const distractors = seededShuffle(
    fact.distractors,
    `${fact.id}:distractors:${variant}`
  );

  const answerPosition = seededIndex(
    `${fact.id}:answer:${variant}`,
    4
  );

  const options: string[] = [];
  let distractorIndex = 0;

  for (let position = 0; position < 4; position++) {
    if (position === answerPosition) {
      options.push(fact.correct);
    } else {
      options.push(distractors[distractorIndex++]);
    }
  }

  return {
    id: `${fact.id}-${variant}`,
    question,
    options,
    answer: answerPosition,
    explanation: EXPLANATIONS[language](fact),
    sourceFactId: fact.id,
  };
}

/**
 * Maximum deterministic variants currently exposed by this generator.
 * This is a variant pool, not 100,000 independently authored facts.
 */
export function getQuestionCapacity(): number {
  const variantsPerFact = 500;
  const templateCount = PROMPTS.en.length;

  return Math.min(
    100_000,
    QUESTION_BANK.length * variantsPerFact * templateCount
  );
}

export function createNextQuestion(
  language: QuestionLanguage = "en",
  previouslyUsedIds: string[] = []
): GeneratedQuestion {
  const used = new Set(previouslyUsedIds);
  const variantsPerFact = 500;

  const totalCandidates =
    QUESTION_BANK.length * variantsPerFact;

  const start =
    hashString(
      `${language}:${previouslyUsedIds.length}:${previouslyUsedIds.join("|")}`
    ) % totalCandidates;

  for (let offset = 0; offset < totalCandidates; offset++) {
    const flatIndex = (start + offset) % totalCandidates;
    const factIndex = Math.floor(flatIndex / variantsPerFact);
    const variant = flatIndex % variantsPerFact;

    const fact = QUESTION_BANK[factIndex];
    const candidate = buildQuestion(fact, variant, language);

    if (!used.has(candidate.id)) {
      return candidate;
    }
  }

  throw new Error(
    "MindaGames question pool exhausted. Add more facts or variants."
  );
}
