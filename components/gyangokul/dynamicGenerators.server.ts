import type {
  ClassLevel,
  Language,
  Subject,
} from "./gameTypes";

import type {
  QuizQuestion,
} from "./questionTypes";

/*
 * ============================================================
 * DYNAMIC SUBJECTS
 * ============================================================
 */

export const DYNAMIC_SUBJECTS: Subject[] = [
  "mathematics",
  "science",
  "gk",
  "english",
  "evs",
];

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

type RandomGenerator = {
  nextInt(min: number, max: number): number;
  pick<T>(items: T[]): T;
};

type LocalizedText = {
  en: string;
  hi: string;
  or: string;
};

type ChoiceQuestion = {
  question: LocalizedText;
  answer: string;
  wrongAnswers: string[];
};

/*
 * ============================================================
 * SEEDED RANDOM
 * ============================================================
 */

function createSeededRandom(
  seed: number
): RandomGenerator {
  let state =
    Math.abs(seed) % 2147483647;

  if (state === 0) {
    state = 1;
  }

  return {
  nextInt(
    min: number,
    max: number
  ): number {
    state =
      (state * 48271) %
      2147483647;

    const ratio =
      state / 2147483647;

    return (
      min +
      Math.floor(
        ratio * (max - min + 1)
      )
    );
  },

  pick<T>(items: T[]): T {
    if (items.length === 0) {
      throw new Error(
        "Cannot pick from an empty array."
      );
    }

    return items[
      this.nextInt(
        0,
        items.length - 1
      )
    ]!;
  },
};
}

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function localize(
  language: Language,
  value: LocalizedText
): string {
  return value[language];
}

function normalizeSubject(
  subject: Subject
): string {
  return String(subject)
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

function shuffle<T>(
  items: T[],
  random: RandomGenerator
): T[] {
  const result = [...items];

  for (
    let index = result.length - 1;
    index > 0;
    index--
  ) {
    const swapIndex =
      random.nextInt(0, index);

    [
      result[index],
      result[swapIndex],
    ] = [
      result[swapIndex],
      result[index],
    ];
  }

  return result;
}

function makeOptions(
  correctAnswer: string,
  wrongAnswers: string[],
  random: RandomGenerator
): {
  options: string[];
  correctIndex: number;
} {
  const values: string[] = [];

  const addValue = (value: string) => {
    const clean =
      value.trim();

    if (
      clean &&
      !values.includes(clean)
    ) {
      values.push(clean);
    }
  };

  addValue(correctAnswer);

  for (
    const wrong of wrongAnswers
  ) {
    addValue(wrong);
  }

  let fallback = 1;

  while (values.length < 4) {
    const candidate =
      `Option ${fallback}`;

    fallback++;

    addValue(candidate);
  }

  const options =
    shuffle(
      values.slice(0, 4),
      random
    );

  return {
    options,
    correctIndex:
      options.indexOf(
        correctAnswer
      ),
  };
}

function makeQuestion(
  classLevel: ClassLevel,
  language: Language,
  subject: Subject,
  seed: number,
  question: string,
  options: string[],
  correctIndex: number
): QuizQuestion {
  return {
    id:
      `dyn-${normalizeSubject(subject)
        .replace(/\s+/g, "-")}-${classLevel}-${language}-${seed}`,

    classLevel,
    language,
    subject,
    source: "dynamic",
    question,
    options,
    correctIndex,
  };
}

function numericOptions(
  answer: number,
  random: RandomGenerator,
  offsets: number[] = [
    -1,
    1,
    2,
  ]
) {
  return makeOptions(
    String(answer),
    offsets.map(
      (offset) =>
        String(answer + offset)
    ),
    random
  );
}

function classBand(
  classLevel: ClassLevel
):
  | "early"
  | "lower"
  | "middle"
  | "upper"
  | "secondary" {
  if (
    classLevel === "KG1" ||
    classLevel === "KG2"
  ) {
    return "early";
  }

  if (
    classLevel === "1" ||
    classLevel === "2" ||
    classLevel === "3"
  ) {
    return "lower";
  }

  if (
    classLevel === "4" ||
    classLevel === "5"
  ) {
    return "middle";
  }

  if (
    classLevel === "6" ||
    classLevel === "7" ||
    classLevel === "8"
  ) {
    return "upper";
  }

  return "secondary";
}

/*
 * ============================================================
 * MATHEMATICS
 * ============================================================
 */

function generateEarlyMath(
  classLevel: "KG1" | "KG2",
  language: Language,
  seed: number,
  random: RandomGenerator
): QuizQuestion {
  const variant =
    random.nextInt(0, 7);

  let question: string;
  let answer: number;

  switch (variant) {
    case 0: {
      const a =
        random.nextInt(1, 9);

      const b =
        random.nextInt(1, 9);

      answer = a + b;

      question =
        localize(language, {
          en: `What is ${a} + ${b}?`,
          hi: `${a} + ${b} कितना है?`,
          or: `${a} + ${b} କେତେ?`,
        });

      break;
    }

    case 1: {
      const a =
        random.nextInt(3, 15);

      const b =
        random.nextInt(1, a);

      answer = a - b;

      question =
        localize(language, {
          en: `What is ${a} - ${b}?`,
          hi: `${a} - ${b} कितना है?`,
          or: `${a} - ${b} କେତେ?`,
        });

      break;
    }

    case 2: {
      const a =
        random.nextInt(1, 5);

      const b =
        random.nextInt(1, 5);

      answer = a + b;

      question =
        localize(language, {
          en:
            `You have ${a} balls and get ${b} more. How many balls do you have?`,
          hi:
            `आपके पास ${a} गेंदें हैं और ${b} और मिलती हैं। अब कितनी गेंदें हैं?`,
          or:
            `ତୁମ ପାଖରେ ${a}ଟି ବଲ ଅଛି ଏବଂ ଆଉ ${b}ଟି ମିଳିଲା। ଏବେ କେତେଟି ବଲ ଅଛି?`,
        });

      break;
    }

    case 3: {
      const groups =
        random.nextInt(1, 5);

      const each =
        random.nextInt(1, 5);

      answer =
        groups * each;

      question =
        localize(language, {
          en:
            `There are ${groups} groups with ${each} objects in each group. How many objects are there?`,
          hi:
            `${groups} समूह हैं और हर समूह में ${each} वस्तुएँ हैं। कुल कितनी वस्तुएँ हैं?`,
          or:
            `${groups}ଟି ଗୋଷ୍ଠୀରେ ପ୍ରତ୍ୟେକରେ ${each}ଟି ବସ୍ତୁ ଅଛି। ମୋଟ କେତେଟି ବସ୍ତୁ?`,
        });

      break;
    }

    case 4: {
      const a =
        random.nextInt(1, 20);

      const b =
        random.nextInt(1, 20);

      answer =
        Math.max(a, b);

      question =
        localize(language, {
          en:
            `Which number is greater: ${a} or ${b}?`,
          hi:
            `${a} और ${b} में बड़ी संख्या कौन सी है?`,
          or:
            `${a} ଏବଂ ${b} ମଧ୍ୟରୁ କେଉଁ ସଂଖ୍ୟା ବଡ଼?`,
        });

      break;
    }

    case 5: {
      const number =
        random.nextInt(1, 20);

      answer = number + 1;

      question =
        localize(language, {
          en:
            `What number comes after ${number}?`,
          hi:
            `${number} के बाद कौन सी संख्या आती है?`,
          or:
            `${number} ପରେ କେଉଁ ସଂଖ୍ୟା ଆସେ?`,
        });

      break;
    }

    case 6: {
      const number =
        random.nextInt(1, 20);

      answer =
        number % 2 === 0
          ? 2
          : 1;

      question =
        localize(language, {
          en:
            `Is ${number} even or odd? Choose 2 for even and 1 for odd.`,
          hi:
            `${number} सम है या विषम? सम के लिए 2 और विषम के लिए 1 चुनें।`,
          or:
            `${number} ଯୁଗ୍ମ କି ବିଜୁଗ୍ମ? ଯୁଗ୍ମ ପାଇଁ 2 ଏବଂ ବିଜୁଗ୍ମ ପାଇଁ 1 ବାଛ।`,
        });

      break;
    }

    default: {
      answer = 4;

      question =
        localize(language, {
          en:
            "How many sides does a square have?",
          hi:
            "एक वर्ग की कितनी भुजाएँ होती हैं?",
          or:
            "ଏକ ବର୍ଗର କେତୋଟି ପାର୍ଶ୍ୱ ଅଛି?",
        });
    }
  }

  const result =
    numericOptions(
      answer,
      random
    );

  return makeQuestion(
    classLevel,
    language,
    "mathematics",
    seed,
    question,
    result.options,
    result.correctIndex
  );
}

function generateLowerMath(
  classLevel: "1" | "2" | "3",
  language: Language,
  seed: number,
  random: RandomGenerator
): QuizQuestion {
  const variant =
    random.nextInt(0, 9);

  let question: string;
  let answer: number;

  switch (variant) {
    case 0: {
      const max =
        classLevel === "1"
          ? 50
          : classLevel === "2"
            ? 200
            : 500;

      const a =
        random.nextInt(1, max);

      const b =
        random.nextInt(1, max);

      answer = a + b;

      question =
        localize(language, {
          en: `What is ${a} + ${b}?`,
          hi: `${a} + ${b} कितना है?`,
          or: `${a} + ${b} କେତେ?`,
        });

      break;
    }

    case 1: {
      const max =
        classLevel === "1"
          ? 50
          : classLevel === "2"
            ? 200
            : 500;

      const a =
        random.nextInt(10, max);

      const b =
        random.nextInt(1, a);

      answer = a - b;

      question =
        localize(language, {
          en: `What is ${a} - ${b}?`,
          hi: `${a} - ${b} कितना है?`,
          or: `${a} - ${b} କେତେ?`,
        });

      break;
    }

    case 2: {
      const max =
        classLevel === "1"
          ? 5
          : classLevel === "2"
            ? 10
            : 12;

      const a =
        random.nextInt(2, max);

      const b =
        random.nextInt(2, max);

      answer =
        a * b;

      question =
        localize(language, {
          en: `What is ${a} × ${b}?`,
          hi: `${a} × ${b} कितना है?`,
          or: `${a} × ${b} କେତେ?`,
        });

      break;
    }

    case 3: {
      const divisor =
        random.nextInt(2, 12);

      const quotient =
        random.nextInt(2, 20);

      const dividend =
        divisor * quotient;

      answer = quotient;

      question =
        localize(language, {
          en:
            `What is ${dividend} ÷ ${divisor}?`,
          hi:
            `${dividend} ÷ ${divisor} कितना है?`,
          or:
            `${dividend} ÷ ${divisor} କେତେ?`,
        });

      break;
    }

    case 4: {
      const number =
        random.nextInt(10, 999);

      const place =
        random.nextInt(0, 2);

      const placeValue =
        place === 0
          ? 1
          : place === 1
            ? 10
            : 100;

      answer =
        Math.floor(
          number /
            placeValue
        ) % 10;

      question =
        localize(language, {
          en:
            `What is the ${place === 0 ? "ones" : place === 1 ? "tens" : "hundreds"} digit in ${number}?`,
          hi:
            `${number} में ${place === 0 ? "इकाई" : place === 1 ? "दहाई" : "सैकड़ा"} का अंक क्या है?`,
          or:
            `${number} ର ${place === 0 ? "ଏକକ" : place === 1 ? "ଦଶକ" : "ଶତକ"} ଅଙ୍କ କେତେ?`,
        });

      break;
    }

    case 5: {
      const number =
        random.nextInt(10, 500);

      answer = number + 10;

      question =
        localize(language, {
          en:
            `What is ${number} + 10?`,
          hi:
            `${number} + 10 कितना है?`,
          or:
            `${number} + 10 କେତେ?`,
        });

      break;
    }

    case 6: {
      const number =
        random.nextInt(10, 500);

      answer = number - 10;

      question =
        localize(language, {
          en:
            `What is ${number} - 10?`,
          hi:
            `${number} - 10 कितना है?`,
          or:
            `${number} - 10 କେତେ?`,
        });

      break;
    }

    case 7: {
      const length =
        random.nextInt(2, 20);

      const width =
        random.nextInt(2, 15);

      answer =
        length * width;

      question =
        localize(language, {
          en:
            `A rectangle has length ${length} and width ${width}. What is its area?`,
          hi:
            `एक आयत की लंबाई ${length} और चौड़ाई ${width} है। उसका क्षेत्रफल कितना है?`,
          or:
            `ଏକ ଆୟତର ଦୈର୍ଘ୍ୟ ${length} ଏବଂ ପ୍ରସ୍ଥ ${width}। ତାହାର କ୍ଷେତ୍ରଫଳ କେତେ?`,
        });

      break;
    }

    case 8: {
      const number =
        random.nextInt(2, 10);

      answer =
        number * 10;

      question =
        localize(language, {
          en:
            `What is ${number} tens?`,
          hi:
            `${number} दहाई कितनी होती है?`,
          or:
            `${number} ଦଶକ କେତେ?`,
        });

      break;
    }

    default: {
      const a =
        random.nextInt(1, 50);

      const b =
        random.nextInt(1, 50);

      answer =
        Math.max(a, b);

      question =
        localize(language, {
          en:
            `Which is greater: ${a} or ${b}?`,
          hi:
            `${a} और ${b} में कौन बड़ी है?`,
          or:
            `${a} ଏବଂ ${b} ମଧ୍ୟରୁ କେଉଁଟି ବଡ଼?`,
        });
    }
  }

  const result =
    numericOptions(
      answer,
      random
    );

  return makeQuestion(
    classLevel,
    language,
    "mathematics",
    seed,
    question,
    result.options,
    result.correctIndex
  );
}

function generateMiddleMath(
  classLevel: "4" | "5",
  language: Language,
  seed: number,
  random: RandomGenerator
): QuizQuestion {
  const variant =
    random.nextInt(0, 9);

  let question: string;
  let answer: number;

  switch (variant) {
    case 0: {
      const a =
        random.nextInt(100, 999);
      const b =
        random.nextInt(100, 999);

      answer = a + b;

      question =
        localize(language, {
          en: `What is ${a} + ${b}?`,
          hi: `${a} + ${b} कितना है?`,
          or: `${a} + ${b} କେତେ?`,
        });

      break;
    }

    case 1: {
      const a =
        random.nextInt(200, 9999);

      const b =
        random.nextInt(1, a);

      answer = a - b;

      question =
        localize(language, {
          en: `What is ${a} - ${b}?`,
          hi: `${a} - ${b} कितना है?`,
          or: `${a} - ${b} କେତେ?`,
        });

      break;
    }

    case 2: {
      const a =
        random.nextInt(10, 99);

      const b =
        random.nextInt(2, 20);

      answer = a * b;

      question =
        localize(language, {
          en: `What is ${a} × ${b}?`,
          hi: `${a} × ${b} कितना है?`,
          or: `${a} × ${b} କେତେ?`,
        });

      break;
    }

    case 3: {
      const divisor =
        random.nextInt(2, 20);

      const quotient =
        random.nextInt(2, 50);

      const dividend =
        divisor * quotient;

      answer = quotient;

      question =
        localize(language, {
          en:
            `What is ${dividend} ÷ ${divisor}?`,
          hi:
            `${dividend} ÷ ${divisor} कितना है?`,
          or:
            `${dividend} ÷ ${divisor} କେତେ?`,
        });

      break;
    }

    case 4: {
      const denominator =
        random.nextInt(2, 10);

      const numerator =
        random.nextInt(
          1,
          denominator - 1
        );

      const groups =
        random.nextInt(2, 20);

      const total =
        denominator * groups;

      answer =
        (total * numerator) /
        denominator;

      question =
        localize(language, {
          en:
            `What is ${numerator}/${denominator} of ${total}?`,
          hi:
            `${total} का ${numerator}/${denominator} कितना है?`,
          or:
            `${total} ର ${numerator}/${denominator} କେତେ?`,
        });

      break;
    }

    case 5: {
      const total =
        random.nextInt(50, 500);

      const percent =
        random.nextInt(10, 50);

      answer =
        (total * percent) /
        100;

      question =
        localize(language, {
          en:
            `What is ${percent}% of ${total}?`,
          hi:
            `${total} का ${percent}% कितना है?`,
          or:
            `${total} ର ${percent}% କେତେ?`,
        });

      break;
    }

    case 6: {
      const length =
        random.nextInt(3, 40);

      const width =
        random.nextInt(3, 30);

      answer =
        length * width;

      question =
        localize(language, {
          en:
            `What is the area of a rectangle with length ${length} cm and width ${width} cm?`,
          hi:
            `लंबाई ${length} सेमी और चौड़ाई ${width} सेमी वाले आयत का क्षेत्रफल कितना है?`,
          or:
            `ଦୈର୍ଘ୍ୟ ${length} ସେ.ମି. ଏବଂ ପ୍ରସ୍ଥ ${width} ସେ.ମି. ଥିବା ଆୟତର କ୍ଷେତ୍ରଫଳ କେତେ?`,
        });

      break;
    }

    case 7: {
      const side =
        random.nextInt(3, 40);

      answer =
        side * 4;

      question =
        localize(language, {
          en:
            `What is the perimeter of a square with side ${side} cm?`,
          hi:
            `${side} सेमी भुजा वाले वर्ग का परिमाप कितना है?`,
          or:
            `${side} ସେ.ମି. ଭୁଜା ଥିବା ବର୍ଗର ପରିସୀମା କେତେ?`,
        });

      break;
    }

    case 8: {
      const hours =
        random.nextInt(1, 8);

      const minutes =
        random.nextInt(1, 59);

      answer =
        hours * 60 + minutes;

      question =
        localize(language, {
          en:
            `How many minutes are in ${hours} hours and ${minutes} minutes?`,
          hi:
            `${hours} घंटे और ${minutes} मिनट में कुल कितने मिनट हैं?`,
          or:
            `${hours} ଘଣ୍ଟା ଏବଂ ${minutes} ମିନିଟରେ ମୋଟ କେତେ ମିନିଟ?`,
        });

      break;
    }

    default: {
      const a =
        random.nextInt(10, 100);

      const b =
        random.nextInt(1, 9);

      answer = a - b;

      question =
        localize(language, {
          en:
            `What is ${a} - ${b}?`,
          hi:
            `${a} - ${b} कितना है?`,
          or:
            `${a} - ${b} କେତେ?`,
        });
    }
  }

  const result =
    numericOptions(
      answer,
      random
    );

  return makeQuestion(
    classLevel,
    language,
    "mathematics",
    seed,
    question,
    result.options,
    result.correctIndex
  );
}

function generateUpperMath(
  classLevel:
    | "6"
    | "7"
    | "8",
  language: Language,
  seed: number,
  random: RandomGenerator
): QuizQuestion {
  const variant =
    random.nextInt(0, 9);

  let question: string;
  let answer: number;

  switch (variant) {
    case 0: {
      const percent =
        random.nextInt(10, 90);

      const base =
        random.nextInt(10, 50) * 10;

      answer =
        (base * percent) /
        100;

      question =
        localize(language, {
          en:
            `What is ${percent}% of ${base}?`,
          hi:
            `${base} का ${percent}% कितना है?`,
          or:
            `${base} ର ${percent}% କେତେ?`,
        });

      break;
    }

    case 1: {
      const a =
        random.nextInt(-100, 200);

      const b =
        random.nextInt(-100, 200);

      answer = a + b;

      question =
        localize(language, {
          en: `What is ${a} + ${b}?`,
          hi: `${a} + ${b} कितना है?`,
          or: `${a} + ${b} କେତେ?`,
        });

      break;
    }

    case 2: {
      const coefficient =
        random.nextInt(2, 20);

      const x =
        random.nextInt(1, 30);

      const constant =
        random.nextInt(1, 50);

      answer =
        coefficient * x +
        constant;

      question =
        localize(language, {
          en:
            `If x = ${x}, what is ${coefficient}x + ${constant}?`,
          hi:
            `यदि x = ${x}, तो ${coefficient}x + ${constant} का मान क्या है?`,
          or:
            `ଯଦି x = ${x}, ତେବେ ${coefficient}x + ${constant} ର ମୂଲ୍ୟ କେତେ?`,
        });

      break;
    }

    case 3: {
      const base =
        random.nextInt(2, 12);

      const power =
        random.nextInt(2, 3);

      answer =
        Math.pow(base, power);

      question =
        localize(language, {
          en:
            `What is ${base} raised to the power ${power}?`,
          hi:
            `${base} की घात ${power} का मान क्या है?`,
          or:
            `${base} ର ଘାତ ${power} ର ମୂଲ୍ୟ କେତେ?`,
        });

      break;
    }

    case 4: {
      const distance =
        random.nextInt(20, 300);

      const time =
        random.nextInt(2, 20);

      answer =
        distance / time;

      question =
        localize(language, {
          en:
            `A vehicle travels ${distance} km in ${time} hours. What is its average speed in km/h?`,
          hi:
            `एक वाहन ${time} घंटे में ${distance} किमी चलता है। इसकी औसत गति किमी/घंटा में कितनी है?`,
          or:
            `ଗୋଟିଏ ଯାନ ${time} ଘଣ୍ଟାରେ ${distance} କି.ମି. ଯାଏ। ଏହାର ହାରାହାରି ବେଗ କି.ମି./ଘଣ୍ଟାରେ କେତେ?`,
        });

      break;
    }

    case 5: {
      const length =
        random.nextInt(5, 40);

      const width =
        random.nextInt(5, 30);

      answer =
        2 * (length + width);

      question =
        localize(language, {
          en:
            `Find the perimeter of a rectangle with length ${length} and width ${width}.`,
          hi:
            `लंबाई ${length} और चौड़ाई ${width} वाले आयत का परिमाप ज्ञात करें।`,
          or:
            `ଦୈର୍ଘ୍ୟ ${length} ଏବଂ ପ୍ରସ୍ଥ ${width} ଥିବା ଆୟତର ପରିସୀମା ନିର୍ଣ୍ଣୟ କର।`,
        });

      break;
    }

    case 6: {
      const mass =
        random.nextInt(50, 500);

      const volume =
        random.nextInt(5, 25);

      answer =
        mass / volume;

      question =
        localize(language, {
          en:
            `An object has mass ${mass} g and volume ${volume} cm³. What is its density in g/cm³?`,
          hi:
            `एक वस्तु का द्रव्यमान ${mass} ग्राम और आयतन ${volume} सेमी³ है। इसका घनत्व कितना है?`,
          or:
            `ଗୋଟିଏ ବସ୍ତୁର ଦ୍ରବ୍ୟମାନ ${mass} ଗ୍ରାମ ଏବଂ ଆୟତନ ${volume} ସେ.ମି.³। ଏହାର ଘନତା କେତେ?`,
        });

      break;
    }

    case 7: {
      const numerator =
        random.nextInt(1, 9);

      const denominator =
        random.nextInt(
          numerator + 1,
          20
        );

      answer =
        numerator;

      question =
        localize(language, {
          en:
            `In the fraction ${numerator}/${denominator}, what is the numerator?`,
          hi:
            `भिन्न ${numerator}/${denominator} में अंश कौन सा है?`,
          or:
            `${numerator}/${denominator} ଭଗ୍ନାଂଶର ଅଂଶ କେତେ?`,
        });

      break;
    }

    case 8: {
      const force =
        random.nextInt(5, 100);

      const distance =
        random.nextInt(2, 30);

      answer =
        force * distance;

      question =
        localize(language, {
          en:
            `A force of ${force} N moves an object ${distance} m. What work is done?`,
          hi:
            `${force} N का बल किसी वस्तु को ${distance} m तक ले जाता है। किया गया कार्य कितना है?`,
          or:
            `${force} N ବଳରେ ଏକ ବସ୍ତୁ ${distance} m ଗତି କରେ। କାମ କେତେ ହେଲା?`,
        });

      break;
    }

    default: {
      const a =
        random.nextInt(10, 100);

      const b =
        random.nextInt(2, 20);

      answer =
        a * b;

      question =
        localize(language, {
          en:
            `What is ${a} × ${b}?`,
          hi:
            `${a} × ${b} कितना है?`,
          or:
            `${a} × ${b} କେତେ?`,
        });
    }
  }

  const result =
    numericOptions(
      answer,
      random
    );

  return makeQuestion(
    classLevel,
    language,
    "mathematics",
    seed,
    question,
    result.options,
    result.correctIndex
  );
}

function generateSecondaryMath(
  classLevel:
    | "9"
    | "10",
  language: Language,
  seed: number,
  random: RandomGenerator
): QuizQuestion {
  const variant =
    random.nextInt(0, 10);

  let question: string;
  let answer: number;

  switch (variant) {
    case 0: {
      const voltage =
        random.nextInt(10, 100);

      const resistance =
        random.nextInt(2, 20);

      answer =
        voltage /
        resistance;

      question =
        localize(language, {
          en:
            `If voltage is ${voltage} V and resistance is ${resistance} Ω, what is the current in amperes?`,
          hi:
            `यदि वोल्टेज ${voltage} V और प्रतिरोध ${resistance} Ω है, तो धारा कितनी एम्पियर होगी?`,
          or:
            `ଯଦି ଭୋଲ୍ଟେଜ୍ ${voltage} V ଏବଂ ପ୍ରତିରୋଧ ${resistance} Ω, ତେବେ ଧାରା କେତେ ଆମ୍ପିୟର?`,
        });

      break;
    }

    case 1: {
      const force =
        random.nextInt(10, 100);

      const mass =
        random.nextInt(2, 20);

      answer =
        force / mass;

      question =
        localize(language, {
          en:
            `A force of ${force} N acts on a mass of ${mass} kg. What is the acceleration?`,
          hi:
            `${force} N का बल ${mass} kg द्रव्यमान पर लगता है। त्वरण कितना है?`,
          or:
            `${force} N ବଳ ${mass} kg ଦ୍ରବ୍ୟମାନ ଉପରେ କାର୍ଯ୍ୟ କରେ। ତ୍ୱରଣ କେତେ?`,
        });

      break;
    }

    case 2: {
      const work =
        random.nextInt(100, 1000);

      const time =
        random.nextInt(2, 20);

      answer =
        work / time;

      question =
        localize(language, {
          en:
            `If ${work} J of work is done in ${time} seconds, what is the power in watts?`,
          hi:
            `यदि ${time} सेकंड में ${work} J कार्य किया जाता है, तो शक्ति कितने वाट होगी?`,
          or:
            `ଯଦି ${time} ସେକେଣ୍ଡରେ ${work} J କାମ ହୁଏ, ତେବେ ଶକ୍ତି କେତେ ୱାଟ?`,
        });

      break;
    }

    case 3: {
      const percent =
        random.nextInt(5, 95);

      const base =
        random.nextInt(10, 500);

      answer =
        (base * percent) /
        100;

      question =
        localize(language, {
          en:
            `What is ${percent}% of ${base}?`,
          hi:
            `${base} का ${percent}% कितना है?`,
          or:
            `${base} ର ${percent}% କେତେ?`,
        });

      break;
    }

    case 4: {
      const a =
        random.nextInt(2, 20);

      const b =
        random.nextInt(2, 20);

      const c =
        random.nextInt(1, 20);

      answer =
        a * b + c;

      question =
        localize(language, {
          en:
            `What is (${a} × ${b}) + ${c}?`,
          hi:
            `(${a} × ${b}) + ${c} का मान क्या है?`,
          or:
            `(${a} × ${b}) + ${c} ର ମୂଲ୍ୟ କେତେ?`,
        });

      break;
    }

    case 5: {
      const base =
        random.nextInt(2, 15);

      const power =
        random.nextInt(2, 3);

      answer =
        Math.pow(
          base,
          power
        );

      question =
        localize(language, {
          en:
            `What is ${base} raised to the power ${power}?`,
          hi:
            `${base} की घात ${power} का मान क्या है?`,
          or:
            `${base} ର ଘାତ ${power} ର ମୂଲ୍ୟ କେତେ?`,
        });

      break;
    }

    case 6: {
      const radius =
        random.nextInt(2, 20);

      answer =
        Number(
          (
            3.14 *
            radius *
            radius
          ).toFixed(2)
        );

      question =
        localize(language, {
          en:
            `Using π ≈ 3.14, what is the area of a circle with radius ${radius}?`,
          hi:
            `π ≈ 3.14 मानकर ${radius} त्रिज्या वाले वृत्त का क्षेत्रफल कितना है?`,
          or:
            `π ≈ 3.14 ଧରି ${radius} ତ୍ରଜ୍ୟା ବିଶିଷ୍ଟ ବୃତ୍ତର କ୍ଷେତ୍ରଫଳ କେତେ?`,
        });

      break;
    }

    case 7: {
      const length =
        random.nextInt(5, 50);

      const width =
        random.nextInt(5, 50);

      answer =
        length * width;

      question =
        localize(language, {
          en:
            `What is the area of a rectangle with length ${length} and width ${width}?`,
          hi:
            `लंबाई ${length} और चौड़ाई ${width} वाले आयत का क्षेत्रफल कितना है?`,
          or:
            `ଦୈର୍ଘ୍ୟ ${length} ଏବଂ ପ୍ରସ୍ଥ ${width} ଥିବା ଆୟତର କ୍ଷେତ୍ରଫଳ କେତେ?`,
        });

      break;
    }

    case 8: {
      const a =
        random.nextInt(-100, 200);

      const b =
        random.nextInt(-100, 200);

      answer =
        a + b;

      question =
        localize(language, {
          en:
            `What is ${a} + ${b}?`,
          hi:
            `${a} + ${b} कितना है?`,
          or:
            `${a} + ${b} କେତେ?`,
        });

      break;
    }

    case 9: {
      const distance =
        random.nextInt(100, 900);

      const time =
        random.nextInt(2, 20);

      answer =
        distance / time;

      question =
        localize(language, {
          en:
            `A car travels ${distance} km in ${time} hours. What is its average speed?`,
          hi:
            `एक कार ${time} घंटे में ${distance} किमी चलती है। इसकी औसत गति कितनी है?`,
          or:
            `ଗୋଟିଏ କାର୍ ${time} ଘଣ୍ଟାରେ ${distance} କି.ମି. ଯାଏ। ଏହାର ହାରାହାରି ବେଗ କେତେ?`,
        });

      break;
    }

    default: {
      const a =
        random.nextInt(10, 100);

      const b =
        random.nextInt(2, 20);

      answer =
        a * b;

      question =
        localize(language, {
          en:
            `What is ${a} × ${b}?`,
          hi:
            `${a} × ${b} कितना है?`,
          or:
            `${a} × ${b} କେତେ?`,
        });
    }
  }

  const result =
    numericOptions(
      answer,
      random
    );

  return makeQuestion(
    classLevel,
    language,
    "mathematics",
    seed,
    question,
    result.options,
    result.correctIndex
  );
}

export function generateMathQuestion(
  classLevel: ClassLevel,
  language: Language,
  seed: number
): QuizQuestion {
  const random =
    createSeededRandom(seed);

  const band =
    classBand(classLevel);

  if (
  band === "early" &&
  (classLevel === "KG1" ||
    classLevel === "KG2")
) {
    return generateEarlyMath(
      classLevel,
      language,
      seed,
      random
    );
  }

  if (
  band === "lower" &&
  (classLevel === "1" ||
    classLevel === "2" ||
    classLevel === "3")
) {
    return generateLowerMath(
      classLevel,
      language,
      seed,
      random
    );
  }

  if (
  band === "middle" &&
  (classLevel === "4" ||
    classLevel === "5")
) {
    return generateMiddleMath(
      classLevel,
      language,
      seed,
      random
    );
  }

  if (
  band === "upper" &&
  (classLevel === "6" ||
    classLevel === "7" ||
    classLevel === "8")
) {
    return generateUpperMath(
      classLevel,
      language,
      seed,
      random
    );
  }

  if (
  band === "secondary" &&
  (classLevel === "9" ||
    classLevel === "10")
) {
  return generateSecondaryMath(
    classLevel,
    language,
    seed,
    random
  );
}

throw new Error(
  `Invalid mathematics class level: ${classLevel}`
);
}

/*
 * ============================================================
 * SCIENCE
 * ============================================================
 */

const earlyAnimals = [
  "cat",
  "dog",
  "cow",
  "horse",
  "goat",
  "lion",
  "tiger",
  "elephant",
];

const earlySounds = [
  "meow",
  "bark",
  "moo",
  "neigh",
  "bleat",
  "roar",
  "roar",
  "trumpet",
];

const plantParts = [
  "root",
  "leaf",
  "flower",
  "stem",
  "fruit",
];

const lowerAnimals = [
  "cow",
  "dog",
  "cat",
  "hen",
  "fish",
  "frog",
  "butterfly",
  "goat",
  "horse",
  "elephant",
];

const lowerMaterials = [
  "wood",
  "plastic",
  "iron",
  "glass",
  "rubber",
  "paper",
];

const scienceMiddleFacts: ChoiceQuestion[] = [
  {
    question: {
      en: "Which organ pumps blood around the body?",
      hi: "कौन सा अंग पूरे शरीर में रक्त पंप करता है?",
      or: "କେଉଁ ଅଙ୍ଗ ସାରା ଶରୀରକୁ ରକ୍ତ ପମ୍ପ କରେ?",
    },
    answer: "Heart",
    wrongAnswers: [
      "Lung",
      "Stomach",
      "Brain",
    ],
  },
  {
    question: {
      en: "Which gas do humans need for breathing?",
      hi: "मनुष्यों को साँस लेने के लिए किस गैस की आवश्यकता होती है?",
      or: "ମଣିଷ ଶ୍ୱାସ ନେବା ପାଇଁ କେଉଁ ଗ୍ୟାସ ଆବଶ୍ୟକ କରେ?",
    },
    answer: "Oxygen",
    wrongAnswers: [
      "Nitrogen",
      "Hydrogen",
      "Helium",
    ],
  },
  {
    question: {
      en: "Which force pulls objects toward Earth?",
      hi: "कौन सा बल वस्तुओं को पृथ्वी की ओर खींचता है?",
      or: "କେଉଁ ବଳ ବସ୍ତୁକୁ ପୃଥିବୀ ଦିଗକୁ ଟାଣେ?",
    },
    answer: "Gravity",
    wrongAnswers: [
      "Friction",
      "Sound",
      "Heat",
    ],
  },
  {
    question: {
      en: "Which process changes liquid water into water vapour?",
      hi: "कौन सी प्रक्रिया द्रव जल को जलवाष्प में बदलती है?",
      or: "କେଉଁ ପ୍ରକ୍ରିୟା ତରଳ ପାଣିକୁ ଜଳବାଷ୍ପରେ ପରିଣତ କରେ?",
    },
    answer: "Evaporation",
    wrongAnswers: [
      "Condensation",
      "Freezing",
      "Melting",
    ],
  },
  {
    question: {
      en: "Which organ mainly helps digest food?",
      hi: "भोजन को पचाने में मुख्य रूप से कौन सा अंग मदद करता है?",
      or: "ଖାଦ୍ୟ ହଜମ କରିବାରେ ମୁଖ୍ୟତଃ କେଉଁ ଅଙ୍ଗ ସାହାଯ୍ୟ କରେ?",
    },
    answer: "Stomach",
    wrongAnswers: [
      "Heart",
      "Lung",
      "Eye",
    ],
  },
  {
    question: {
      en: "Which material is strongly attracted by a magnet?",
      hi: "कौन सा पदार्थ चुंबक द्वारा आकर्षित होता है?",
      or: "କେଉଁ ପଦାର୍ଥ ଚୁମ୍ବକ ଦ୍ୱାରା ଆକର୍ଷିତ ହୁଏ?",
    },
    answer: "Iron",
    wrongAnswers: [
      "Wood",
      "Plastic",
      "Glass",
    ],
  },
  {
    question: {
      en: "Which part of a plant usually absorbs water from the soil?",
      hi: "पौधे का कौन सा भाग सामान्यतः मिट्टी से पानी सोखता है?",
      or: "ଗଛର କେଉଁ ଅଂଶ ସାଧାରଣତଃ ମାଟିରୁ ପାଣି ଶୋଷେ?",
    },
    answer: "Root",
    wrongAnswers: [
      "Leaf",
      "Flower",
      "Fruit",
    ],
  },
  {
    question: {
      en: "Which gas is released by green plants during photosynthesis?",
      hi: "प्रकाश संश्लेषण के दौरान हरे पौधे कौन सी गैस छोड़ते हैं?",
      or: "ପ୍ରକାଶ ସଂଶ୍ଳେଷଣ ସମୟରେ ସବୁଜ ଗଛ କେଉଁ ଗ୍ୟାସ ଛାଡ଼େ?",
    },
    answer: "Oxygen",
    wrongAnswers: [
      "Nitrogen",
      "Hydrogen",
      "Methane",
    ],
  },
];

const scienceUpperFacts: ChoiceQuestion[] = [
  {
    question: {
      en: "What is the basic unit of life?",
      hi: "जीवन की मूल इकाई क्या है?",
      or: "ଜୀବନର ମୌଳିକ ଏକକ କଣ?",
    },
    answer: "Cell",
    wrongAnswers: [
      "Tissue",
      "Organ",
      "Atom",
    ],
  },
  {
    question: {
      en: "Which gas is most abundant in Earth's atmosphere?",
      hi: "पृथ्वी के वायुमंडल में सबसे अधिक कौन सी गैस है?",
      or: "ପୃଥିବୀର ବାୟୁମଣ୍ଡଳରେ ସବୁଠାରୁ ଅଧିକ କେଉଁ ଗ୍ୟାସ ଅଛି?",
    },
    answer: "Nitrogen",
    wrongAnswers: [
      "Oxygen",
      "Carbon dioxide",
      "Hydrogen",
    ],
  },
  {
    question: {
      en: "Which organelle is called the powerhouse of the cell?",
      hi: "कोशिका का पावरहाउस किस अंगक को कहा जाता है?",
      or: "କୋଷର ପାୱାରହାଉସ୍ କେଉଁ ଅଙ୍ଗାଣୁକୁ କୁହାଯାଏ?",
    },
    answer: "Mitochondria",
    wrongAnswers: [
      "Nucleus",
      "Ribosome",
      "Vacuole",
    ],
  },
  {
    question: {
      en: "What is the SI unit of force?",
      hi: "बल की SI इकाई क्या है?",
      or: "ବଳର SI ଏକକ କଣ?",
    },
    answer: "Newton",
    wrongAnswers: [
      "Joule",
      "Watt",
      "Pascal",
    ],
  },
  {
    question: {
      en: "Which process do green plants use to make food?",
      hi: "हरे पौधे भोजन बनाने के लिए किस प्रक्रिया का उपयोग करते हैं?",
      or: "ସବୁଜ ଗଛ ଖାଦ୍ୟ ତିଆରି ପାଇଁ କେଉଁ ପ୍ରକ୍ରିୟା ବ୍ୟବହାର କରେ?",
    },
    answer: "Photosynthesis",
    wrongAnswers: [
      "Respiration",
      "Digestion",
      "Filtration",
    ],
  },
  {
    question: {
      en: "Which organ filters waste from blood?",
      hi: "कौन सा अंग रक्त से अपशिष्ट पदार्थ छानता है?",
      or: "କେଉଁ ଅଙ୍ଗ ରକ୍ତରୁ ଅବଶିଷ୍ଟ ପଦାର୍ଥ ଛାଣେ?",
    },
    answer: "Kidney",
    wrongAnswers: [
      "Liver",
      "Heart",
      "Lung",
    ],
  },
  {
    question: {
      en: "Which blood cells help fight infections?",
      hi: "कौन सी रक्त कोशिकाएँ संक्रमण से लड़ने में मदद करती हैं?",
      or: "କେଉଁ ରକ୍ତ କୋଷିକା ସଂକ୍ରମଣ ସହିତ ଲଢ଼ିବାରେ ସାହାଯ୍ୟ କରେ?",
    },
    answer: "White blood cells",
    wrongAnswers: [
      "Red blood cells",
      "Platelets",
      "Plasma",
    ],
  },
  {
    question: {
      en: "Which change of state turns a solid directly into a gas?",
      hi: "कौन सा अवस्था परिवर्तन ठोस को सीधे गैस में बदलता है?",
      or: "କେଉଁ ଅବସ୍ଥା ପରିବର୍ତ୍ତନରେ ଠୋସ ସିଧାସଳଖ ଗ୍ୟାସରେ ପରିଣତ ହୁଏ?",
    },
    answer: "Sublimation",
    wrongAnswers: [
      "Melting",
      "Freezing",
      "Condensation",
    ],
  },
];

function generateScienceQuestion(
  classLevel: ClassLevel,
  language: Language,
  seed: number
): QuizQuestion {
  const random = createSeededRandom(seed);
  const band = classBand(classLevel);

  if (band === "early") {
    const animals = [
      ["cat", "meow"],
      ["dog", "bark"],
      ["cow", "moo"],
      ["horse", "neigh"],
      ["lion", "roar"],
      ["tiger", "roar"],
      ["goat", "bleat"],
      ["elephant", "trumpet"],
      ["frog", "croak"],
      ["duck", "quack"],
      ["sheep", "bleat"],
      ["snake", "hiss"],
    ];

    const senses = [
      ["Eyes", "see"],
      ["Ears", "hear"],
      ["Nose", "smell"],
      ["Tongue", "taste"],
      ["Skin", "feel"],
    ];

    const plantFunctions = [
      ["Root", "takes in water from soil"],
      ["Stem", "supports the plant"],
      ["Leaf", "helps make food"],
      ["Flower", "helps the plant reproduce"],
      ["Fruit", "protects seeds"],
    ];

    const livingThings = [
      ["dog", "Living"],
      ["cat", "Living"],
      ["tree", "Living"],
      ["bird", "Living"],
      ["flower", "Living"],
      ["rock", "Non-living"],
      ["chair", "Non-living"],
      ["book", "Non-living"],
      ["ball", "Non-living"],
      ["table", "Non-living"],
      ["bicycle", "Non-living"],
      ["pencil", "Non-living"],
    ];

    const weatherClothes = [
      ["rainy", "raincoat"],
      ["cold", "sweater"],
      ["hot", "cotton clothes"],
      ["sunny", "hat"],
      ["windy", "jacket"],
      ["snowy", "warm coat"],
    ];

    const bodyParts = [
      ["eyes", "see"],
      ["ears", "hear"],
      ["nose", "smell"],
      ["tongue", "taste"],
      ["hands", "hold things"],
      ["legs", "walk"],
      ["teeth", "chew food"],
      ["feet", "stand and walk"],
    ];

    const variant = random.nextInt(0, 7);

    let question: string;
    let answer: string;
    let wrongAnswers: string[];

    switch (variant) {
      case 0: {
        const item = animals[
          random.nextInt(0, animals.length - 1)
        ];

        answer = item[1];

        question = localize(language, {
          en: `Which sound does a ${item[0]} make?`,
          hi: `${item[0]} कौन सी आवाज़ करता है?`,
          or: `${item[0]} କେଉଁ ଶବ୍ଦ କରେ?`,
        });

        wrongAnswers = animals
          .map((entry) => entry[1])
          .filter((value) => value !== answer)
          .slice(0, 8);

        break;
      }

      case 1: {
        const item = plantFunctions[
          random.nextInt(
            0,
            plantFunctions.length - 1
          )
        ];

        answer = item[0];

        question = localize(language, {
          en: `Which plant part ${item[1]}?`,
          hi: `ପौधे का कौन सा भाग ${item[1]}?`,
          or: `ଗଛର କେଉଁ ଅଂଶ ${item[1]}?`,
        });

        wrongAnswers = plantFunctions
          .map((entry) => entry[0])
          .filter((value) => value !== answer);

        break;
      }

      case 2: {
        const item = senses[
          random.nextInt(0, senses.length - 1)
        ];

        answer = item[0];

        question = localize(language, {
          en: `Which body part helps us ${item[1]}?`,
          hi: `${item[1]} के लिए कौन सा अंग मदद करता है?`,
          or: `${item[1]} କରିବାରେ କେଉଁ ଅଙ୍ଗ ସାହାଯ୍ୟ କରେ?`,
        });

        wrongAnswers = senses
          .map((entry) => entry[0])
          .filter((value) => value !== answer);

        break;
      }

      case 3: {
        const item = livingThings[
          random.nextInt(
            0,
            livingThings.length - 1
          )
        ];

        answer = item[1];

        question = localize(language, {
          en: `Is a ${item[0]} living or non-living?`,
          hi: `${item[0]} सजीव है या निर्जीव?`,
          or: `${item[0]} ଜୀବିତ କି ଅଜୀବ?`,
        });

        wrongAnswers =
          answer === "Living"
            ? ["Non-living", "Object", "Toy"]
            : ["Living", "Animal", "Plant"];

        break;
      }

      case 4: {
        const item = weatherClothes[
          random.nextInt(
            0,
            weatherClothes.length - 1
          )
        ];

        answer = item[1];

        question = localize(language, {
          en: `What is useful on a ${item[0]} day?`,
          hi: `${item[0]} दिन में क्या उपयोगी है?`,
          or: `${item[0]} ଦିନରେ କଣ ଉପଯୋଗୀ?`,
        });

        wrongAnswers = weatherClothes
          .map((entry) => entry[1])
          .filter((value) => value !== answer)
          .slice(0, 3);

        break;
      }

      case 5: {
        const item = bodyParts[
          random.nextInt(
            0,
            bodyParts.length - 1
          )
        ];

        answer = item[0];

        question = localize(language, {
          en: `Which body part do we use to ${item[1]}?`,
          hi: `${item[1]} के लिए हम किस अंग का उपयोग करते हैं?`,
          or: `${item[1]} ପାଇଁ ଆମେ କେଉଁ ଅଙ୍ଗ ବ୍ୟବହାର କରୁ?`,
        });

        wrongAnswers = bodyParts
          .map((entry) => entry[0])
          .filter((value) => value !== answer)
          .slice(0, 6);

        break;
      }

      case 6: {
        const amount = random.nextInt(2, 15);

        answer = String(amount + 1);

        question = localize(language, {
          en: `A plant has ${amount} leaves and grows ${random.nextInt(
            1,
            5
          )} more leaves. How many leaves does it have now?`,
          hi: `एक पौधे पर ${amount} पत्ते हैं और ${random.nextInt(
            1,
            5
          )} और पत्ते उगते हैं। अब कितने पत्ते हैं?`,
          or: `ଗଛରେ ${amount}ଟି ପତ୍ର ଅଛି ଏବଂ ଆଉ କିଛି ପତ୍ର ବଢ଼ିଲା। ଏବେ କେତେ ପତ୍ର ଅଛି?`,
        });

        wrongAnswers = [
          String(amount),
          String(amount + 2),
          String(Math.max(1, amount - 1)),
        ];

        break;
      }

      default: {
        const temperature = random.nextInt(18, 42);

        answer =
          temperature >= 30
            ? "Hot"
            : temperature <= 23
              ? "Cool"
              : "Mild";

        question = localize(language, {
          en: `If the temperature is ${temperature}°C, is the weather hot, mild, or cool?`,
          hi: `तापमान ${temperature}°C है। मौसम गर्म, सामान्य या ठंडा है?`,
          or: `ତାପମାତ୍ରା ${temperature}°C ହେଲେ ପାଗ ଗରମ, ସାଧାରଣ କି ଥଣ୍ଡା?`,
        });

        wrongAnswers = ["Hot", "Mild", "Cool"].filter(
          (value) => value !== answer
        );
      }
    }

    const result = makeOptions(
      answer,
      wrongAnswers,
      random
    );

    return makeQuestion(
      classLevel,
      language,
      "science",
      seed,
      question,
      result.options,
      result.correctIndex
    );
  }

  if (band === "lower") {
    const habitats = [
      ["camel", "desert"],
      ["fish", "water"],
      ["polar bear", "polar region"],
      ["monkey", "forest"],
      ["frog", "pond"],
      ["cow", "farm"],
      ["lion", "grassland"],
      ["penguin", "polar region"],
      ["tiger", "forest"],
      ["dolphin", "ocean"],
    ];

    const materialUses = [
      ["glass", "window"],
      ["wood", "table"],
      ["paper", "book"],
      ["rubber", "eraser"],
      ["metal", "spoon"],
      ["plastic", "bottle"],
      ["cotton", "shirt"],
      ["wool", "sweater"],
    ];

    const states = [
      ["ice", "Solid"],
      ["water", "Liquid"],
      ["steam", "Gas"],
      ["milk", "Liquid"],
      ["stone", "Solid"],
      ["air", "Gas"],
    ];

    const pushPull = [
      ["opening a drawer", "Pull"],
      ["closing a door", "Push"],
      ["kicking a ball", "Push"],
      ["pulling a rope", "Pull"],
      ["pushing a cart", "Push"],
      ["drawing a bucket from a well", "Pull"],
      ["pushing a swing", "Push"],
      ["pulling a suitcase", "Pull"],
    ];

    const plants = [
      ["root", "takes in water"],
      ["leaf", "makes food"],
      ["stem", "supports the plant"],
      ["flower", "helps reproduction"],
      ["fruit", "contains seeds"],
    ];

    const animals = [
      ["cow", "Mammal"],
      ["dog", "Mammal"],
      ["cat", "Mammal"],
      ["goat", "Mammal"],
      ["horse", "Mammal"],
      ["hen", "Bird"],
      ["sparrow", "Bird"],
      ["fish", "Fish"],
      ["frog", "Amphibian"],
      ["snake", "Reptile"],
    ];

    const variant = random.nextInt(0, 9);

    let question: string;
    let answer: string;
    let wrongAnswers: string[];

    switch (variant) {
      case 0: {
        const item = habitats[
          random.nextInt(0, habitats.length - 1)
        ];

        answer = item[1];

        question = localize(language, {
          en: `Where does a ${item[0]} usually live?`,
          hi: `${item[0]} सामान्यतः कहाँ रहता है?`,
          or: `${item[0]} ସାଧାରଣତଃ କେଉଁଠି ରହେ?`,
        });

        wrongAnswers = habitats
          .map((entry) => entry[1])
          .filter((value) => value !== answer);

        break;
      }

      case 1: {
        const item = materialUses[
          random.nextInt(
            0,
            materialUses.length - 1
          )
        ];

        answer = item[0];

        question = localize(language, {
          en: `Which material is commonly used to make a ${item[1]}?`,
          hi: `${item[1]} बनाने के लिए सामान्यतः किस पदार्थ का उपयोग होता है?`,
          or: `${item[1]} ତିଆରି କରିବାକୁ ସାଧାରଣତଃ କେଉଁ ପଦାର୍ଥ ବ୍ୟବହାର ହୁଏ?`,
        });

        wrongAnswers = materialUses
          .map((entry) => entry[0])
          .filter((value) => value !== answer);

        break;
      }

      case 2: {
        const item = states[
          random.nextInt(0, states.length - 1)
        ];

        answer = item[1];

        question = localize(language, {
          en: `What state of matter is ${item[0]}?`,
          hi: `${item[0]} पदार्थ की कौन सी अवस्था है?`,
          or: `${item[0]} କେଉଁ ପଦାର୍ଥ ଅବସ୍ଥାରେ ଅଛି?`,
        });

        wrongAnswers = ["Solid", "Liquid", "Gas"].filter(
          (value) => value !== answer
        );

        break;
      }

      case 3: {
        const item = pushPull[
          random.nextInt(
            0,
            pushPull.length - 1
          )
        ];

        answer = item[1];

        question = localize(language, {
          en: `Is ${item[0]} a push or a pull?`,
          hi: `${item[0]} धक्का है या खींचना?`,
          or: `${item[0]} ଠେଲିବା କି ଟାଣିବା?`,
        });

        wrongAnswers = ["Push", "Pull", "Gravity"].filter(
          (value) => value !== answer
        );

        break;
      }

      case 4: {
        const item = plants[
          random.nextInt(0, plants.length - 1)
        ];

        answer = item[0];

        question = localize(language, {
          en: `Which plant part ${item[1]}?`,
          hi: `पौधे का कौन सा भाग ${item[1]}?`,
          or: `ଗଛର କେଉଁ ଅଂଶ ${item[1]}?`,
        });

        wrongAnswers = plants
          .map((entry) => entry[0])
          .filter((value) => value !== answer);

        break;
      }

      case 5: {
        const item = animals[
          random.nextInt(0, animals.length - 1)
        ];

        answer = item[1];

        question = localize(language, {
          en: `What type of animal is a ${item[0]}?`,
          hi: `${item[0]} किस प्रकार का जानवर है?`,
          or: `${item[0]} କେଉଁ ପ୍ରକାରର ପଶୁ?`,
        });

        wrongAnswers = [
          "Mammal",
          "Bird",
          "Fish",
          "Reptile",
          "Amphibian",
        ].filter((value) => value !== answer);

        break;
      }

      case 6: {
        const hours = random.nextInt(1, 8);
        const extra = random.nextInt(1, 5);

        answer = String(hours + extra);

        question = localize(language, {
          en: `A plant is watered ${hours} times in the morning and ${extra} more times later. How many times is it watered?`,
          hi: `एक पौधे को सुबह ${hours} बार और बाद में ${extra} बार पानी दिया गया। कुल कितनी बार पानी दिया गया?`,
          or: `ଗଛକୁ ସକାଳେ ${hours} ଥର ଏବଂ ପରେ ${extra} ଥର ପାଣି ଦିଆଗଲା। ମୋଟ କେତେ ଥର?`,
        });

        wrongAnswers = [
          String(hours),
          String(extra),
          String(Math.max(1, hours + extra + 1)),
        ];

        break;
      }

      case 7: {
        const material = random.pick([
          "iron",
          "steel",
          "nickel",
          "cobalt",
        ]);

        answer = "Magnetic";

        question = localize(language, {
          en: `What property does ${material} commonly show?`,
          hi: `${material} में कौन सा गुण सामान्यतः पाया जाता है?`,
          or: `${material} ରେ ସାଧାରଣତଃ କେଉଁ ଗୁଣ ଦେଖାଯାଏ?`,
        });

        wrongAnswers = [
          "Magnetic",
          "Transparent",
          "Edible",
          "Liquid",
        ].filter((value) => value !== answer);

        break;
      }

      case 8: {
        const objects = [
          ["mirror", "reflection"],
          ["torch", "light"],
          ["bell", "sound"],
          ["fan", "moving air"],
          ["heater", "heat"],
          ["radio", "sound"],
          ["lamp", "light"],
          ["drum", "sound"],
        ];

        const item = objects[
          random.nextInt(0, objects.length - 1)
        ];

        answer = item[1];

        question = localize(language, {
          en: `What does a ${item[0]} mainly produce?`,
          hi: `${item[0]} मुख्य रूप से क्या उत्पन्न करता है?`,
          or: `${item[0]} ମୁଖ୍ୟତଃ କଣ ଉତ୍ପନ୍ନ କରେ?`,
        });

        wrongAnswers = objects
          .map((entry) => entry[1])
          .filter((value) => value !== answer);

        break;
      }

      default: {
        const amount = random.nextInt(2, 20);
        const more = random.nextInt(1, 10);

        answer = String(amount + more);

        question = localize(language, {
          en: `A child collects ${amount} leaves and then collects ${more} more. How many leaves are there altogether?`,
          hi: `एक बच्चा ${amount} पत्ते इकट्ठे करता है और ${more} और पत्ते इकट्ठे करता है। कुल कितने पत्ते हैं?`,
          or: `ଜଣେ ଶିଶୁ ${amount}ଟି ପତ୍ର ଏବଂ ଆଉ ${more}ଟି ପତ୍ର ସଂଗ୍ରହ କଲା। ମୋଟ କେତେ?`,
        });

        wrongAnswers = [
          String(amount),
          String(more),
          String(amount + more + 1),
        ];
      }
    }

    const result = makeOptions(
      answer,
      wrongAnswers,
      random
    );

    return makeQuestion(
      classLevel,
      language,
      "science",
      seed,
      question,
      result.options,
      result.correctIndex
    );
  }

  if (band === "middle") {
    const organFacts = [
      ["heart", "pumps blood"],
      ["lungs", "help us breathe"],
      ["stomach", "helps digest food"],
      ["brain", "controls the body"],
      ["kidneys", "filter wastes from blood"],
      ["skin", "protects the body"],
      ["small intestine", "absorbs nutrients"],
      ["bones", "support the body"],
    ];

    const conductorFacts = [
      ["copper", "Conductor"],
      ["aluminium", "Conductor"],
      ["iron", "Conductor"],
      ["steel", "Conductor"],
      ["silver", "Conductor"],
      ["wood", "Insulator"],
      ["rubber", "Insulator"],
      ["plastic", "Insulator"],
      ["glass", "Insulator"],
    ];

    const heatChanges = [
      ["ice", "melting"],
      ["water", "freezing"],
      ["water vapour", "condensation"],
      ["wet clothes", "evaporation"],
    ];

    const foodChain = [
      ["grass", "cow"],
      ["grass", "goat"],
      ["leaves", "caterpillar"],
      ["algae", "fish"],
      ["seeds", "sparrow"],
      ["plants", "deer"],
      ["plants", "rabbit"],
      ["nectar", "butterfly"],
    ];

    const variant = random.nextInt(0, 8);

    let question: string;
    let answer: string;
    let wrongAnswers: string[];

    switch (variant) {
      case 0: {
        const item = organFacts[
          random.nextInt(
            0,
            organFacts.length - 1
          )
        ];

        answer = item[0];

        question = localize(language, {
          en: `Which organ ${item[1]}?`,
          hi: `कौन सा अंग ${item[1]}?`,
          or: `କେଉଁ ଅଙ୍ଗ ${item[1]}?`,
        });

        wrongAnswers = organFacts
          .map((entry) => entry[0])
          .filter((value) => value !== answer);

        break;
      }

      case 1: {
        const item = conductorFacts[
          random.nextInt(
            0,
            conductorFacts.length - 1
          )
        ];

        answer = item[1];

        question = localize(language, {
          en: `Is ${item[0]} a conductor or an insulator?`,
          hi: `${item[0]} चालक है या कुचालक?`,
          or: `${item[0]} ପରିବାହକ କି ଅପରିବାହକ?`,
        });

        wrongAnswers = ["Conductor", "Insulator"].filter(
          (value) => value !== answer
        );

        break;
      }

      case 2: {
        const item = heatChanges[
          random.nextInt(
            0,
            heatChanges.length - 1
          )
        ];

        answer = item[1];

        question = localize(language, {
          en: `What process is involved when ${item[0]} changes in this way?`,
          hi: `${item[0]} में यह परिवर्तन होने पर कौन सी प्रक्रिया होती है?`,
          or: `${item[0]} ଏପରି ବଦଳିଲେ କେଉଁ ପ୍ରକ୍ରିୟା ଘଟେ?`,
        });

        wrongAnswers = [
          "melting",
          "freezing",
          "condensation",
          "evaporation",
        ].filter((value) => value !== answer);

        break;
      }

      case 3: {
        const item = foodChain[
          random.nextInt(
            0,
            foodChain.length - 1
          )
        ];

        answer = item[1];

        question = localize(language, {
          en: `Which animal commonly eats ${item[0]}?`,
          hi: `${item[0]} को कौन सा जानवर खाता है?`,
          or: `${item[0]} କୁ କେଉଁ ପଶୁ ସାଧାରଣତଃ ଖାଏ?`,
        });

        wrongAnswers = foodChain
          .map((entry) => entry[1])
          .filter((value) => value !== answer);

        break;
      }

      case 4: {
        const speed = random.nextInt(5, 50);
        const time = random.nextInt(2, 10);
        const distance = speed * time;

        answer = String(speed);

        question = localize(language, {
          en: `A cyclist travels ${distance} km in ${time} hours. What is the average speed?`,
          hi: `एक साइकिल चालक ${time} घंटे में ${distance} किमी चलता है। औसत गति क्या है?`,
          or: `ଜଣେ ସାଇକେଲ ଚାଳକ ${time} ଘଣ୍ଟାରେ ${distance} କି.ମି. ଯାଏ। ହାରାହାରି ବେଗ କେତେ?`,
        });

        wrongAnswers = [
          String(Math.max(1, speed - 2)),
          String(speed + 2),
          String(speed + 5),
        ];

        break;
      }

      case 5: {
        const density = random.nextInt(1, 20);
        const volume = random.nextInt(5, 40);
        const mass = density * volume;

        answer = String(density);

        question = localize(language, {
          en: `An object has mass ${mass} g and volume ${volume} cm³. What is its density in g/cm³?`,
          hi: `एक वस्तु का द्रव्यमान ${mass} g और आयतन ${volume} cm³ है। घनत्व कितना है?`,
          or: `ଗୋଟିଏ ବସ୍ତୁର ଦ୍ରବ୍ୟମାନ ${mass} g ଏବଂ ଆୟତନ ${volume} cm³। ଘନତା କେତେ?`,
        });

        wrongAnswers = [
          String(Math.max(1, density - 1)),
          String(density + 1),
          String(density + 2),
        ];

        break;
      }

      case 6: {
        const base = random.nextInt(2, 12);
        const factor = random.nextInt(2, 10);
        const answerValue = base * factor;

        answer = String(answerValue);

        question = localize(language, {
          en: `A force of ${base} N acts over ${factor} m. What is the work done?`,
          hi: `${base} N का बल ${factor} m दूरी तक कार्य करता है। कार्य कितना है?`,
          or: `${base} N ବଳ ${factor} m ଦୂରତା ଗତି କରାଇଲେ କାମ କେତେ?`,
        });

        wrongAnswers = [
          String(Math.max(1, answerValue - base)),
          String(answerValue + base),
          String(answerValue + 5),
        ];

        break;
      }

      case 7: {
        const item = [
          ["green plants", "photosynthesis"],
          ["humans", "respiration"],
          ["roots", "water absorption"],
          ["leaves", "food production"],
          ["kidneys", "waste removal"],
          ["lungs", "gas exchange"],
        ][random.nextInt(0, 5)];

        answer = item[1];

        question = localize(language, {
          en: `Which process or function is associated with ${item[0]}?`,
          hi: `${item[0]} से कौन सी प्रक्रिया या क्रिया जुड़ी है?`,
          or: `${item[0]} ସହିତ କେଉଁ ପ୍ରକ୍ରିୟା ବା କାର୍ଯ୍ୟ ଜଡିତ?`,
        });

        wrongAnswers = [
          "photosynthesis",
          "respiration",
          "water absorption",
          "food production",
          "waste removal",
          "gas exchange",
        ].filter((value) => value !== answer);

        break;
      }

      default: {
        const hours = random.nextInt(1, 12);
        const minutes = random.nextInt(1, 59);
        const total = hours * 60 + minutes;

        answer = String(total);

        question = localize(language, {
          en: `How many minutes are in ${hours} hours and ${minutes} minutes?`,
          hi: `${hours} घंटे और ${minutes} मिनट में कुल कितने मिनट हैं?`,
          or: `${hours} ଘଣ୍ଟା ଏବଂ ${minutes} ମିନିଟରେ ମୋଟ କେତେ ମିନିଟ?`,
        });

        wrongAnswers = [
          String(total + 10),
          String(Math.max(1, total - 10)),
          String(total + 60),
        ];
      }
    }

    const result = makeOptions(
      answer,
      wrongAnswers,
      random
    );

    return makeQuestion(
      classLevel,
      language,
      "science",
      seed,
      question,
      result.options,
      result.correctIndex
    );
  }

  if (band === "upper") {
    const facts = [
      ["cell", "basic unit of life"],
      ["mitochondria", "powerhouse of the cell"],
      ["chlorophyll", "green pigment in plants"],
      ["neuron", "cell that carries nerve signals"],
      ["gravity", "force that attracts objects toward Earth"],
      ["Newton", "SI unit of force"],
      ["Joule", "SI unit of energy"],
      ["Watt", "SI unit of power"],
      ["oxygen", "gas required for aerobic respiration"],
      ["nitrogen", "most abundant gas in the atmosphere"],
    ];

    const variant = random.nextInt(0, 6);

    let question: string;
    let answer: string;
    let wrongAnswers: string[];

    switch (variant) {
      case 0: {
        const item = facts[
          random.nextInt(0, facts.length - 1)
        ];

        answer = item[0];

        question = localize(language, {
          en: `Which term matches: ${item[1]}?`,
          hi: `${item[1]} के लिए सही शब्द कौन सा है?`,
          or: `${item[1]} ପାଇଁ ସଠିକ ଶବ୍ଦ କେଉଁଟି?`,
        });

        wrongAnswers = facts
          .map((entry) => entry[0])
          .filter((value) => value !== answer);

        break;
      }

      case 1: {
        const speed = random.nextInt(10, 80);
        const time = random.nextInt(2, 12);
        const distance = speed * time;

        answer = String(speed);

        question = localize(language, {
          en: `A vehicle travels ${distance} km in ${time} hours. What is its average speed?`,
          hi: `एक वाहन ${time} घंटे में ${distance} किमी चलता है। उसकी औसत गति क्या है?`,
          or: `ଗୋଟିଏ ଯାନ ${time} ଘଣ୍ଟାରେ ${distance} କି.ମି. ଯାଏ। ତାହାର ହାରାହାରି ବେଗ କେତେ?`,
        });

        wrongAnswers = [
          String(speed - 5),
          String(speed + 5),
          String(speed + 10),
        ];

        break;
      }

      case 2: {
        const voltage = random.nextInt(10, 100);
        const resistance = random.nextInt(2, 10);
        const adjustedVoltage =
          voltage - (voltage % resistance);

        answer = String(
          adjustedVoltage / resistance
        );

        question = localize(language, {
          en: `If voltage is ${adjustedVoltage} V and resistance is ${resistance} Ω, what is the current?`,
          hi: `यदि वोल्टेज ${adjustedVoltage} V और प्रतिरोध ${resistance} Ω है, तो धारा कितनी है?`,
          or: `ଯଦି ଭୋଲ୍ଟେଜ୍ ${adjustedVoltage} V ଏବଂ ପ୍ରତିରୋଧ ${resistance} Ω, ତେବେ ଧାରା କେତେ?`,
        });

        const current = adjustedVoltage / resistance;

        wrongAnswers = [
          String(Math.max(1, current - 1)),
          String(current + 1),
          String(current + 2),
        ];

        break;
      }

      case 3: {
        const mass = random.nextInt(2, 30);
        const acceleration = random.nextInt(2, 15);
        const force = mass * acceleration;

        answer = String(force);

        question = localize(language, {
          en: `A mass of ${mass} kg accelerates at ${acceleration} m/s². What force acts on it?`,
          hi: `${mass} kg द्रव्यमान का त्वरण ${acceleration} m/s² है। बल कितना है?`,
          or: `${mass} kg ଦ୍ରବ୍ୟମାନର ତ୍ୱରଣ ${acceleration} m/s² ହେଲେ ବଳ କେତେ?`,
        });

        wrongAnswers = [
          String(Math.max(1, force - mass)),
          String(force + mass),
          String(force + acceleration),
        ];

        break;
      }

      case 4: {
        const mass = random.nextInt(5, 40);
        const height = random.nextInt(2, 20);
        const g = 10;
        const energy = mass * g * height;

        answer = String(energy);

        question = localize(language, {
          en: `Using g = 10 m/s², what is the gravitational potential energy of a ${mass} kg object at ${height} m?`,
          hi: `g = 10 m/s² मानकर ${mass} kg वस्तु ${height} m ऊँचाई पर है। स्थितिज ऊर्जा कितनी है?`,
          or: `g = 10 m/s² ଧରି ${mass} kg ବସ୍ତୁ ${height} m ଉଚ୍ଚତାରେ ଥିଲେ ଗୁରୁତ୍ୱ ସ୍ଥିତିଜ ଶକ୍ତି କେତେ?`,
        });

        wrongAnswers = [
          String(energy + 10),
          String(Math.max(1, energy - 10)),
          String(energy + height),
        ];

        break;
      }

      case 5: {
        const frequency = random.nextInt(2, 20);
        const time = random.nextInt(2, 10);
        const cycles = frequency * time;

        answer = String(cycles);

        question = localize(language, {
          en: `A wave has frequency ${frequency} Hz. How many complete cycles occur in ${time} seconds?`,
          hi: `${frequency} Hz आवृत्ति वाली तरंग ${time} सेकंड में कितने पूर्ण चक्र पूरे करेगी?`,
          or: `${frequency} Hz ଆବୃତ୍ତି ଥିବା ତରଙ୍ଗ ${time} ସେକେଣ୍ଡରେ କେତେ ପୂର୍ଣ୍ଣ ଚକ୍ର କରିବ?`,
        });

        wrongAnswers = [
          String(cycles + frequency),
          String(Math.max(1, cycles - frequency)),
          String(cycles + time),
        ];

        break;
      }

      default: {
        const item = random.pick([
          ["acid", "pH below 7"],
          ["base", "pH above 7"],
          ["neutral", "pH equal to 7"],
        ]);

        answer = item[0];

        question = localize(language, {
          en: `Which type of substance has ${item[1]}?`,
          hi: `${item[1]} वाला पदार्थ किस प्रकार का होता है?`,
          or: `${item[1]} ଥିବା ପଦାର୍ଥ କେଉଁ ପ୍ରକାରର?`,
        });

        wrongAnswers = ["acid", "base", "neutral"].filter(
          (value) => value !== answer
        );
      }
    }

    const result = makeOptions(
      answer,
      wrongAnswers,
      random
    );

    return makeQuestion(
      classLevel,
      language,
      "science",
      seed,
      question,
      result.options,
      result.correctIndex
    );
  }

  // Secondary: Class 9–10
  const variant = random.nextInt(0, 9);

  let question: string;
  let answer: string;
  let wrongAnswers: string[];

  switch (variant) {
    case 0: {
      const resistance = random.nextInt(2, 20);
      const current = random.nextInt(2, 20);
      const voltage = resistance * current;

      answer = String(voltage);

      question = localize(language, {
        en: `A circuit has current ${current} A and resistance ${resistance} Ω. What is the voltage?`,
        hi: `एक परिपथ में धारा ${current} A और प्रतिरोध ${resistance} Ω है। वोल्टेज कितना है?`,
        or: `ଗୋଟିଏ ପରିପଥରେ ଧାରା ${current} A ଏବଂ ପ୍ରତିରୋଧ ${resistance} Ω। ଭୋଲ୍ଟେଜ୍ କେତେ?`,
      });

      wrongAnswers = [
        String(voltage + resistance),
        String(Math.max(1, voltage - resistance)),
        String(voltage + current),
      ];

      break;
    }

    case 1: {
      const mass = random.nextInt(2, 20);
      const acceleration = random.nextInt(2, 15);
      const force = mass * acceleration;

      answer = String(acceleration);

      question = localize(language, {
        en: `A force of ${force} N acts on a ${mass} kg object. What is its acceleration?`,
        hi: `${force} N का बल ${mass} kg वस्तु पर लगता है। त्वरण कितना है?`,
        or: `${force} N ବଳ ${mass} kg ବସ୍ତୁ ଉପରେ ଲାଗିଲେ ତ୍ୱରଣ କେତେ?`,
      });

      wrongAnswers = [
        String(Math.max(1, acceleration - 1)),
        String(acceleration + 1),
        String(acceleration + 2),
      ];

      break;
    }

    case 2: {
      const power = random.nextInt(50, 500);
      const time = random.nextInt(2, 20);
      const work = power * time;

      answer = String(power);

      question = localize(language, {
        en: `If ${work} J of work is done in ${time} seconds, what is the power?`,
        hi: `यदि ${time} सेकंड में ${work} J कार्य किया जाता है, तो शक्ति कितनी है?`,
        or: `ଯଦି ${time} ସେକେଣ୍ଡରେ ${work} J କାମ ହୁଏ, ତେବେ ଶକ୍ତି କେତେ?`,
      });

      wrongAnswers = [
        String(power + 5),
        String(Math.max(1, power - 5)),
        String(power + time),
      ];

      break;
    }

    case 3: {
      const density = random.nextInt(2, 20);
      const volume = random.nextInt(5, 50);
      const mass = density * volume;

      answer = String(density);

      question = localize(language, {
        en: `An object has mass ${mass} g and volume ${volume} cm³. What is its density?`,
        hi: `एक वस्तु का द्रव्यमान ${mass} g और आयतन ${volume} cm³ है। इसका घनत्व कितना है?`,
        or: `ଗୋଟିଏ ବସ୍ତୁର ଦ୍ରବ୍ୟମାନ ${mass} g ଏବଂ ଆୟତନ ${volume} cm³। ଘନତା କେତେ?`,
      });

      wrongAnswers = [
        String(density + 1),
        String(Math.max(1, density - 1)),
        String(density + 2),
      ];

      break;
    }

    case 4: {
      const mass = random.nextInt(2, 20);
      const velocity = random.nextInt(2, 20);
      const energy =
        (mass * velocity * velocity) / 2;

      answer = String(energy);

      question = localize(language, {
        en: `What is the kinetic energy of a ${mass} kg object moving at ${velocity} m/s?`,
        hi: `${mass} kg वस्तु ${velocity} m/s की गति से चल रही है। उसकी गतिज ऊर्जा कितनी है?`,
        or: `${mass} kg ବସ୍ତୁ ${velocity} m/s ବେଗରେ ଚାଲୁଛି। ତାହାର ଗତିଜ ଶକ୍ତି କେତେ?`,
      });

      wrongAnswers = [
        String(energy + mass),
        String(Math.max(1, energy - mass)),
        String(energy + velocity),
      ];

      break;
    }

    case 5: {
      const moles = random.nextInt(1, 10);
      const molarMass = random.nextInt(2, 20) * 2;
      const mass = moles * molarMass;

      answer = String(mass);

      question = localize(language, {
        en: `What is the mass of ${moles} moles of a substance with molar mass ${molarMass} g/mol?`,
        hi: `मोलर द्रव्यमान ${molarMass} g/mol वाले पदार्थ के ${moles} mol का द्रव्यमान कितना है?`,
        or: `${molarMass} g/mol ମୋଲାର ଦ୍ରବ୍ୟମାନ ଥିବା ପଦାର୍ଥର ${moles} mol ର ଦ୍ରବ୍ୟମାନ କେତେ?`,
      });

      wrongAnswers = [
        String(mass + molarMass),
        String(Math.max(1, mass - molarMass)),
        String(mass + moles),
      ];

      break;
    }

    case 6: {
      const base = random.nextInt(2, 12);
      const exponent = random.nextInt(2, 3);
      const value = Math.pow(base, exponent);

      answer = String(value);

      question = localize(language, {
        en: `What is ${base} raised to the power ${exponent}?`,
        hi: `${base} की घात ${exponent} का मान क्या है?`,
        or: `${base} ର ଘାତ ${exponent} ର ମୂଲ୍ୟ କେତେ?`,
      });

      wrongAnswers = [
        String(base * exponent),
        String(value + base),
        String(Math.max(1, value - base)),
      ];

      break;
    }

    case 7: {
      const percentage = random.nextInt(5, 95);
      const base = random.nextInt(10, 100) * 10;
      const value = (base * percentage) / 100;

      answer = String(value);

      question = localize(language, {
        en: `What is ${percentage}% of ${base}?`,
        hi: `${base} का ${percentage}% कितना है?`,
        or: `${base} ର ${percentage}% କେତେ?`,
      });

      wrongAnswers = [
        String(value + 5),
        String(Math.max(1, value - 5)),
        String(base - value),
      ];

      break;
    }

    case 8: {
      const force = random.nextInt(5, 100);
      const area = random.nextInt(1, 20);
      const pressure = force / area;

      answer = String(pressure);

      question = localize(language, {
        en: `A force of ${force} N acts on an area of ${area} m². What is the pressure?`,
        hi: `${force} N का बल ${area} m² क्षेत्रफल पर लगता है। दाब कितना है?`,
        or: `${force} N ବଳ ${area} m² କ୍ଷେତ୍ରଫଳ ଉପରେ କାମ କଲେ ଚାପ କେତେ?`,
      });

      wrongAnswers = [
        String(pressure + 1),
        String(Math.max(1, pressure - 1)),
        String(pressure + area),
      ];

      break;
    }

    default: {
      const reactants = random.pick([
        "acid + base",
        "metal + acid",
        "fuel + oxygen",
        "salt + water",
      ]);

      const typeMap: Record<string, string> = {
        "acid + base": "Neutralisation",
        "metal + acid": "Displacement",
        "fuel + oxygen": "Combustion",
        "salt + water": "Dissolution",
      };

      answer = typeMap[reactants];

      question = localize(language, {
        en: `Which process best describes ${reactants}?`,
        hi: `${reactants} किस प्रक्रिया का उदाहरण है?`,
        or: `${reactants} କେଉଁ ପ୍ରକ୍ରିୟାର ଉଦାହରଣ?`,
      });

      wrongAnswers = [
        "Neutralisation",
        "Displacement",
        "Combustion",
        "Dissolution",
      ].filter((value) => value !== answer);
    }
  }

  const result = makeOptions(
    answer,
    wrongAnswers,
    random
  );

  return makeQuestion(
    classLevel,
    language,
    "science",
    seed,
    question,
    result.options,
    result.correctIndex
  );
}

/*
 * ============================================================
 * GK
 * ============================================================
 */

const gkItems: ChoiceQuestion[] = [
  {
    question: {
      en:
        "What is the capital of India?",
      hi:
        "भारत की राजधानी क्या है?",
      or:
        "ଭାରତର ରାଜଧାନୀ କଣ?",
    },
    answer: "New Delhi",
    wrongAnswers: [
      "Mumbai",
      "Kolkata",
      "Chennai",
    ],
  },
  {
    question: {
      en:
        "Which is the largest ocean?",
      hi:
        "सबसे बड़ा महासागर कौन सा है?",
      or:
        "ସବୁଠାରୁ ବଡ଼ ମହାସାଗର କେଉଁଟି?",
    },
    answer: "Pacific Ocean",
    wrongAnswers: [
      "Indian Ocean",
      "Atlantic Ocean",
      "Arctic Ocean",
    ],
  },
  {
    question: {
      en:
        "Which planet is closest to the Sun?",
      hi:
        "सूर्य के सबसे निकट कौन सा ग्रह है?",
      or:
        "ସୂର୍ଯ୍ୟର ସବୁଠାରୁ ନିକଟ ଗ୍ରହ କେଉଁଟି?",
    },
    answer: "Mercury",
    wrongAnswers: [
      "Venus",
      "Earth",
      "Mars",
    ],
  },
  {
    question: {
      en:
        "Which planet is called the Red Planet?",
      hi:
        "कौन सा ग्रह लाल ग्रह कहलाता है?",
      or:
        "କେଉଁ ଗ୍ରହକୁ ଲାଲ ଗ୍ରହ କୁହାଯାଏ?",
    },
    answer: "Mars",
    wrongAnswers: [
      "Venus",
      "Jupiter",
      "Mercury",
    ],
  },
  {
    question: {
      en:
        "Which is the largest continent?",
      hi:
        "सबसे बड़ा महाद्वीप कौन सा है?",
      or:
        "ସବୁଠାରୁ ବଡ଼ ମହାଦ୍ୱୀପ କେଉଁଟି?",
    },
    answer: "Asia",
    wrongAnswers: [
      "Africa",
      "Europe",
      "Australia",
    ],
  },
  {
    question: {
      en:
        "Which is the smallest continent?",
      hi:
        "सबसे छोटा महाद्वीप कौन सा है?",
      or:
        "ସବୁଠାରୁ ଛୋଟ ମହାଦ୍ୱୀପ କେଉଁଟି?",
    },
    answer: "Australia",
    wrongAnswers: [
      "Europe",
      "Africa",
      "South America",
    ],
  },
  {
    question: {
      en:
        "Which line divides Earth into Northern and Southern Hemispheres?",
      hi:
        "कौन सी रेखा पृथ्वी को उत्तरी और दक्षिणी गोलार्ध में बाँटती है?",
      or:
        "କେଉଁ ରେଖା ପୃଥିବୀକୁ ଉତ୍ତର ଓ ଦକ୍ଷିଣ ଗୋଲାର୍ଦ୍ଧରେ ବିଭକ୍ତ କରେ?",
    },
    answer: "Equator",
    wrongAnswers: [
      "Prime Meridian",
      "Tropic of Cancer",
      "Arctic Circle",
    ],
  },
  {
    question: {
      en:
        "What is the capital of Japan?",
      hi:
        "जापान की राजधानी क्या है?",
      or:
        "ଜାପାନର ରାଜଧାନୀ କଣ?",
    },
    answer: "Tokyo",
    wrongAnswers: [
      "Kyoto",
      "Osaka",
      "Hiroshima",
    ],
  },
  {
    question: {
      en:
        "What is the capital of France?",
      hi:
        "फ्रांस की राजधानी क्या है?",
      or:
        "ଫ୍ରାନ୍ସର ରାଜଧାନୀ କଣ?",
    },
    answer: "Paris",
    wrongAnswers: [
      "Rome",
      "Madrid",
      "Berlin",
    ],
  },
  {
    question: {
      en:
        "What is the capital of Australia?",
      hi:
        "ऑस्ट्रेलिया की राजधानी क्या है?",
      or:
        "ଅଷ୍ଟ୍ରେଲିଆର ରାଜଧାନୀ କଣ?",
    },
    answer: "Canberra",
    wrongAnswers: [
      "Sydney",
      "Melbourne",
      "Perth",
    ],
  },
  {
    question: {
      en:
        "Which is the largest planet in the Solar System?",
      hi:
        "सौरमंडल का सबसे बड़ा ग्रह कौन सा है?",
      or:
        "ସୌରମଣ୍ଡଳର ସବୁଠାରୁ ବଡ଼ ଗ୍ରହ କେଉଁଟି?",
    },
    answer: "Jupiter",
    wrongAnswers: [
      "Saturn",
      "Earth",
      "Neptune",
    ],
  },
  {
    question: {
      en:
        "Which planet is famous for its rings?",
      hi:
        "कौन सा ग्रह अपने छल्लों के लिए प्रसिद्ध है?",
      or:
        "କେଉଁ ଗ୍ରହ ତାହାର ବଳୟ ପାଇଁ ପ୍ରସିଦ୍ଧ?",
    },
    answer: "Saturn",
    wrongAnswers: [
      "Mars",
      "Venus",
      "Mercury",
    ],
  },
  {
    question: {
      en:
        "Which is the largest hot desert in the world?",
      hi:
        "दुनिया का सबसे बड़ा गर्म मरुस्थल कौन सा है?",
      or:
        "ପୃଥିବୀର ସବୁଠାରୁ ବଡ଼ ଉଷ୍ଣ ମରୁଭୂମି କେଉଁଟି?",
    },
    answer: "Sahara",
    wrongAnswers: [
      "Gobi",
      "Kalahari",
      "Thar",
    ],
  },
  {
    question: {
      en:
        "Which is the longest river in India?",
      hi:
        "भारत की सबसे लंबी नदी कौन सी है?",
      or:
        "ଭାରତର ସବୁଠାରୁ ଲମ୍ବା ନଦୀ କେଉଁଟି?",
    },
    answer: "Ganga",
    wrongAnswers: [
      "Yamuna",
      "Godavari",
      "Narmada",
    ],
  },
  {
    question: {
      en:
        "Who wrote India's national anthem?",
      hi:
        "भारत का राष्ट्रगान किसने लिखा?",
      or:
        "ଭାରତର ଜାତୀୟ ସଙ୍ଗୀତ କିଏ ଲେଖିଥିଲେ?",
    },
    answer: "Rabindranath Tagore",
    wrongAnswers: [
      "Bankim Chandra Chattopadhyay",
      "Sarojini Naidu",
      "Subhas Chandra Bose",
    ],
  },
  {
    question: {
      en:
        "How many days are there in a week?",
      hi:
        "एक सप्ताह में कितने दिन होते हैं?",
      or:
        "ଗୋଟିଏ ସପ୍ତାହରେ କେତୋଟି ଦିନ ଅଛି?",
    },
    answer: "7",
    wrongAnswers: [
      "5",
      "6",
      "8",
    ],
  },
  {
    question: {
      en:
        "How many months are there in a year?",
      hi:
        "एक वर्ष में कितने महीने होते हैं?",
      or:
        "ଗୋଟିଏ ବର୍ଷରେ କେତୋଟି ମାସ ଅଛି?",
    },
    answer: "12",
    wrongAnswers: [
      "10",
      "11",
      "13",
    ],
  },
];

function generateGKQuestion(
  classLevel: ClassLevel,
  language: Language,
  seed: number
): QuizQuestion {
  const random =
    createSeededRandom(seed);

  const band =
    classBand(classLevel);

  function makeChoice(
    question: string,
    answer: string,
    pool: string[]
  ): QuizQuestion {
    const wrongAnswers =
      shuffle(
        pool.filter(
          (item) =>
            item !== answer
        ),
        random
      ).slice(0, 3);

    const result =
      makeOptions(
        answer,
        wrongAnswers,
        random
      );

    return makeQuestion(
      classLevel,
      language,
      "gk",
      seed,
      question,
      result.options,
      result.correctIndex
    );
  }

  /*
   * ============================================================
   * KG1 / KG2
   * ============================================================
   */

  if (band === "early") {
    const colors = [
      "Red",
      "Blue",
      "Green",
      "Yellow",
      "Black",
      "White",
      "Orange",
      "Purple",
      "Pink",
      "Brown",
    ];

    const shapes = [
      "Circle",
      "Triangle",
      "Square",
      "Rectangle",
      "Pentagon",
      "Hexagon",
    ];

    const animals = [
      ["dog", "4"],
      ["cat", "4"],
      ["cow", "4"],
      ["horse", "4"],
      ["goat", "4"],
      ["lion", "4"],
      ["tiger", "4"],
      ["elephant", "4"],
      ["bird", "2"],
      ["hen", "2"],
      ["duck", "2"],
      ["fish", "0"],
      ["snake", "0"],
      ["butterfly", "6"],
      ["spider", "8"],
      ["ant", "6"],
      ["bee", "6"],
      ["octopus", "8"],
    ];

    const senses = [
      ["see", "Eyes"],
      ["hear", "Ears"],
      ["smell", "Nose"],
      ["taste", "Tongue"],
      ["feel", "Skin"],
      ["chew", "Teeth"],
      ["walk", "Legs"],
      ["hold things", "Hands"],
    ];

    const variant =
      random.nextInt(0, 4);

    if (variant === 0) {
      const color =
        colors[
          random.nextInt(
            0,
            colors.length - 1
          )
        ];

      const form =
        random.nextInt(0, 2);

      if (form === 0) {
        return makeChoice(
          localize(language, {
            en: `What color is usually associated with a ${color === "Blue" ? "clear sky" : color.toLowerCase() === "green" ? "leaf" : color.toLowerCase() + " object"}?`,
            hi: `${color} रंग से संबंधित एक वस्तु का उदाहरण क्या हो सकता है?`,
            or: `${color} ରଙ୍ଗ ସହିତ ସାଧାରଣତଃ କେଉଁ ବସ୍ତୁ ସମ୍ପର୍କିତ?`,
          }),
          color,
          colors
        );
      }

      return makeChoice(
        localize(language, {
          en: `Which one is the color "${color}"?`,
          hi: `"${color}" कौन सा रंग है?`,
          or: `"${color}" କେଉଁ ରଙ୍ଗ?`,
        }),
        color,
        colors
      );
    }

    if (variant === 1) {
      const sides =
        random.nextInt(0, shapes.length - 1);

      const shape =
        shapes[sides];

      const shapeSides: Record<
        string,
        string
      > = {
        Circle: "0",
        Triangle: "3",
        Square: "4",
        Rectangle: "4",
        Pentagon: "5",
        Hexagon: "6",
      };

      const answer =
        shapeSides[shape];

      return makeChoice(
        localize(language, {
          en: `How many sides does a ${shape} have?`,
          hi: `${shape} की कितनी भुजाएँ होती हैं?`,
          or: `${shape} ର କେତୋଟି ପାର୍ଶ୍ୱ ଅଛି?`,
        }),
        answer,
        [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
        ]
      );
    }

    if (variant === 2) {
      const item =
        animals[
          random.nextInt(
            0,
            animals.length - 1
          )
        ];

      return makeChoice(
        localize(language, {
          en: `How many legs does a ${item[0]} have?`,
          hi: `${item[0]} के कितने पैर होते हैं?`,
          or: `${item[0]}ର କେତୋଟି ଗୋଡ଼ ଅଛି?`,
        }),
        item[1],
        [
          "0",
          "2",
          "4",
          "6",
          "8",
        ]
      );
    }

    if (variant === 3) {
      const item =
        senses[
          random.nextInt(
            0,
            senses.length - 1
          )
        ];

      return makeChoice(
        localize(language, {
          en: `Which body part helps us ${item[0]}?`,
          hi: `${item[0]} के लिए कौन सा अंग मदद करता है?`,
          or: `${item[0]} କରିବାରେ କେଉଁ ଅଙ୍ଗ ସାହାଯ୍ୟ କରେ?`,
        }),
        item[1],
        senses.map(
          (entry) => entry[1]
        )
      );
    }

    const number =
      random.nextInt(1, 100);

    const offset =
      random.nextInt(1, 5);

    return makeChoice(
      localize(language, {
        en: `What number comes after ${number} when we count ${offset} more?`,
        hi: `${number} के बाद ${offset} और गिनने पर कौन सी संख्या आएगी?`,
        or: `${number} ପରେ ${offset} ଅଧିକ ଗଣିଲେ କେଉଁ ସଂଖ୍ୟା ଆସିବ?`,
      }),
      String(number + offset),
      [
        String(number),
        String(number + offset - 1),
        String(number + offset + 1),
        String(number + offset + 2),
        String(Math.max(0, number - offset)),
      ]
    );
  }

  /*
   * ============================================================
   * CLASS 1–3
   * ============================================================
   */

  if (band === "lower") {
    const countries = [
      ["India", "New Delhi"],
      ["Japan", "Tokyo"],
      ["France", "Paris"],
      ["Germany", "Berlin"],
      ["Italy", "Rome"],
      ["Spain", "Madrid"],
      ["Portugal", "Lisbon"],
      ["United Kingdom", "London"],
      ["Canada", "Ottawa"],
      ["United States", "Washington, D.C."],
      ["Mexico", "Mexico City"],
      ["Brazil", "Brasília"],
      ["Argentina", "Buenos Aires"],
      ["Chile", "Santiago"],
      ["Peru", "Lima"],
      ["Colombia", "Bogotá"],
      ["Egypt", "Cairo"],
      ["Kenya", "Nairobi"],
      ["Nigeria", "Abuja"],
      ["South Africa", "Pretoria"],
      ["Saudi Arabia", "Riyadh"],
      ["United Arab Emirates", "Abu Dhabi"],
      ["Turkey", "Ankara"],
      ["Iran", "Tehran"],
      ["Iraq", "Baghdad"],
      ["Pakistan", "Islamabad"],
      ["Bangladesh", "Dhaka"],
      ["Nepal", "Kathmandu"],
      ["Bhutan", "Thimphu"],
      ["Sri Lanka", "Sri Jayawardenepura Kotte"],
      ["Thailand", "Bangkok"],
      ["Vietnam", "Hanoi"],
      ["Malaysia", "Kuala Lumpur"],
      ["Singapore", "Singapore"],
      ["Indonesia", "Jakarta"],
      ["Philippines", "Manila"],
      ["China", "Beijing"],
      ["South Korea", "Seoul"],
      ["Australia", "Canberra"],
      ["New Zealand", "Wellington"],
      ["Russia", "Moscow"],
      ["Ukraine", "Kyiv"],
      ["Poland", "Warsaw"],
      ["Greece", "Athens"],
      ["Sweden", "Stockholm"],
      ["Norway", "Oslo"],
      ["Finland", "Helsinki"],
      ["Denmark", "Copenhagen"],
      ["Netherlands", "Amsterdam"],
      ["Belgium", "Brussels"],
    ];

    const planets = [
      "Mercury",
      "Venus",
      "Earth",
      "Mars",
      "Jupiter",
      "Saturn",
      "Uranus",
      "Neptune",
    ];

    const occupations = [
      ["teaches students", "Teacher"],
      ["treats sick people", "Doctor"],
      ["grows crops", "Farmer"],
      ["flies an airplane", "Pilot"],
      ["protects people", "Police Officer"],
      ["puts out fires", "Firefighter"],
      ["delivers letters", "Postal Worker"],
      ["works with books", "Librarian"],
      ["builds houses", "Builder"],
      ["cooks food", "Chef"],
      ["drives a bus", "Bus Driver"],
      ["repairs cars", "Mechanic"],
    ];

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const variant =
      random.nextInt(0, 3);

    if (variant === 0) {
      const item =
        countries[
          random.nextInt(
            0,
            countries.length - 1
          )
        ];

      const reverse =
        random.nextInt(0, 1);

      if (reverse === 0) {
        return makeChoice(
          localize(language, {
            en: `What is the capital of ${item[0]}?`,
            hi: `${item[0]} की राजधानी क्या है?`,
            or: `${item[0]} ରାଜଧାନୀ କଣ?`,
          }),
          item[1],
          countries.map(
            (entry) => entry[1]
          )
        );
      }

      return makeChoice(
        localize(language, {
          en: `${item[1]} is the capital of which country?`,
          hi: `${item[1]} किस देश की राजधानी है?`,
          or: `${item[1]} କେଉଁ ଦେଶର ରାଜଧାନୀ?`,
        }),
        item[0],
        countries.map(
          (entry) => entry[0]
        )
      );
    }

    if (variant === 1) {
      const planet =
        planets[
          random.nextInt(
            0,
            planets.length - 1
          )
        ];

      const descriptions: Record<
        string,
        string
      > = {
        Mercury:
          "closest to the Sun",
        Venus:
          "second planet from the Sun",
        Earth:
          "the planet where we live",
        Mars:
          "called the Red Planet",
        Jupiter:
          "the largest planet",
        Saturn:
          "famous for its rings",
        Uranus:
          "a blue-green planet",
        Neptune:
          "the farthest major planet from the Sun",
      };

      return makeChoice(
        localize(language, {
          en: `Which planet is ${descriptions[planet]}?`,
          hi: `${descriptions[planet]} कौन सा ग्रह है?`,
          or: `${descriptions[planet]} କେଉଁ ଗ୍ରହ?`,
        }),
        planet,
        planets
      );
    }

    if (variant === 2) {
      const item =
        occupations[
          random.nextInt(
            0,
            occupations.length - 1
          )
        ];

      return makeChoice(
        localize(language, {
          en: `Who ${item[0]}?`,
          hi: `कौन ${item[0]}?`,
          or: `କିଏ ${item[0]}?`,
        }),
        item[1],
        occupations.map(
          (entry) => entry[1]
        )
      );
    }

    const month =
      months[
        random.nextInt(
          0,
          months.length - 1
        )
      ];

    const monthIndex =
      months.indexOf(month) + 1;

    return makeChoice(
      localize(language, {
        en: `What number month is ${month}?`,
        hi: `${month} साल का कौन सा महीना है?`,
        or: `${month} ବର୍ଷର କେଉଁ ନମ୍ବର ମାସ?`,
      }),
      String(monthIndex),
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ]
    );
  }

  /*
   * ============================================================
   * CLASS 4–5
   * ============================================================
   */

  if (band === "middle") {
    const countries = [
      ["India", "New Delhi"],
      ["Japan", "Tokyo"],
      ["France", "Paris"],
      ["Germany", "Berlin"],
      ["Italy", "Rome"],
      ["Spain", "Madrid"],
      ["Portugal", "Lisbon"],
      ["United Kingdom", "London"],
      ["Canada", "Ottawa"],
      ["United States", "Washington, D.C."],
      ["Mexico", "Mexico City"],
      ["Brazil", "Brasília"],
      ["Argentina", "Buenos Aires"],
      ["Chile", "Santiago"],
      ["Peru", "Lima"],
      ["Colombia", "Bogotá"],
      ["Egypt", "Cairo"],
      ["Kenya", "Nairobi"],
      ["Nigeria", "Abuja"],
      ["South Africa", "Pretoria"],
      ["Saudi Arabia", "Riyadh"],
      ["United Arab Emirates", "Abu Dhabi"],
      ["Turkey", "Ankara"],
      ["Iran", "Tehran"],
      ["Iraq", "Baghdad"],
      ["Pakistan", "Islamabad"],
      ["Bangladesh", "Dhaka"],
      ["Nepal", "Kathmandu"],
      ["Bhutan", "Thimphu"],
      ["Sri Lanka", "Sri Jayawardenepura Kotte"],
      ["Thailand", "Bangkok"],
      ["Vietnam", "Hanoi"],
      ["Malaysia", "Kuala Lumpur"],
      ["Singapore", "Singapore"],
      ["Indonesia", "Jakarta"],
      ["Philippines", "Manila"],
      ["China", "Beijing"],
      ["South Korea", "Seoul"],
      ["Australia", "Canberra"],
      ["New Zealand", "Wellington"],
      ["Russia", "Moscow"],
      ["Ukraine", "Kyiv"],
      ["Poland", "Warsaw"],
      ["Greece", "Athens"],
      ["Sweden", "Stockholm"],
      ["Norway", "Oslo"],
      ["Finland", "Helsinki"],
      ["Denmark", "Copenhagen"],
      ["Netherlands", "Amsterdam"],
      ["Belgium", "Brussels"],
    ];

    const geography = [
      ["largest continent", "Asia"],
      ["smallest continent", "Australia"],
      ["largest ocean", "Pacific Ocean"],
      ["highest mountain above sea level", "Mount Everest"],
      ["largest hot desert", "Sahara Desert"],
      ["natural satellite of Earth", "Moon"],
      ["star at the centre of our Solar System", "Sun"],
      ["planet closest to the Sun", "Mercury"],
      ["largest planet", "Jupiter"],
      ["planet famous for its rings", "Saturn"],
    ];

    const IndiaFacts = [
      ["national animal", "Bengal Tiger"],
      ["national bird", "Peacock"],
      ["national flower", "Lotus"],
      ["national fruit", "Mango"],
      ["national tree", "Banyan"],
      ["national aquatic animal", "Ganges River Dolphin"],
      ["national anthem", "Jana Gana Mana"],
      ["national song", "Vande Mataram"],
    ];

    const scienceFacts = [
      ["organ that pumps blood", "Heart"],
      ["organ used for breathing", "Lungs"],
      ["basic unit of life", "Cell"],
      ["gas needed for breathing", "Oxygen"],
      ["force that pulls objects toward Earth", "Gravity"],
      ["process by which plants make food", "Photosynthesis"],
      ["SI unit of force", "Newton"],
      ["SI unit of energy", "Joule"],
    ];

    const variant =
      random.nextInt(0, 3);

    if (variant === 0) {
      const item =
        countries[
          random.nextInt(
            0,
            countries.length - 1
          )
        ];

      const reverse =
        random.nextInt(0, 1);

      if (reverse === 0) {
        return makeChoice(
          localize(language, {
            en: `What is the capital of ${item[0]}?`,
            hi: `${item[0]} की राजधानी क्या है?`,
            or: `${item[0]} ରାଜଧାନୀ କଣ?`,
          }),
          item[1],
          countries.map(
            (entry) => entry[1]
          )
        );
      }

      return makeChoice(
        localize(language, {
          en: `${item[1]} is the capital of which country?`,
          hi: `${item[1]} किस देश की राजधानी है?`,
          or: `${item[1]} କେଉଁ ଦେଶର ରାଜଧାନୀ?`,
        }),
        item[0],
        countries.map(
          (entry) => entry[0]
        )
      );
    }

    if (variant === 1) {
      const item =
        geography[
          random.nextInt(
            0,
            geography.length - 1
          )
        ];

      return makeChoice(
        localize(language, {
          en: `Which answer matches "${item[0]}"?`,
          hi: `"${item[0]}" का सही उत्तर कौन सा है?`,
          or: `"${item[0]}" ର ସଠିକ ଉତ୍ତର କେଉଁଟି?`,
        }),
        item[1],
        geography.map(
          (entry) => entry[1]
        )
      );
    }

    if (variant === 2) {
      const item =
        IndiaFacts[
          random.nextInt(
            0,
            IndiaFacts.length - 1
          )
        ];

      return makeChoice(
        localize(language, {
          en: `What is India's ${item[0]}?`,
          hi: `भारत का ${item[0]} क्या है?`,
          or: `ଭାରତର ${item[0]} କଣ?`,
        }),
        item[1],
        IndiaFacts.map(
          (entry) => entry[1]
        )
      );
    }

    const item =
      scienceFacts[
        random.nextInt(
          0,
          scienceFacts.length - 1
        )
      ];

    return makeChoice(
      localize(language, {
        en: `Which answer matches "${item[0]}"?`,
        hi: `"${item[0]}" का सही उत्तर कौन सा है?`,
        or: `"${item[0]}" ର ସଠିକ ଉତ୍ତର କେଉଁଟି?`,
      }),
      item[1],
      scienceFacts.map(
        (entry) => entry[1]
      )
    );
  }

  /*
   * ============================================================
   * CLASS 6–8
   * ============================================================
   */

  if (band === "upper") {
    const countries = [
      ["India", "New Delhi"],
      ["Japan", "Tokyo"],
      ["France", "Paris"],
      ["Germany", "Berlin"],
      ["Italy", "Rome"],
      ["Spain", "Madrid"],
      ["Portugal", "Lisbon"],
      ["United Kingdom", "London"],
      ["Canada", "Ottawa"],
      ["United States", "Washington, D.C."],
      ["Mexico", "Mexico City"],
      ["Brazil", "Brasília"],
      ["Argentina", "Buenos Aires"],
      ["Chile", "Santiago"],
      ["Peru", "Lima"],
      ["Colombia", "Bogotá"],
      ["Egypt", "Cairo"],
      ["Kenya", "Nairobi"],
      ["Nigeria", "Abuja"],
      ["South Africa", "Pretoria"],
      ["Saudi Arabia", "Riyadh"],
      ["United Arab Emirates", "Abu Dhabi"],
      ["Turkey", "Ankara"],
      ["Iran", "Tehran"],
      ["Iraq", "Baghdad"],
      ["Pakistan", "Islamabad"],
      ["Bangladesh", "Dhaka"],
      ["Nepal", "Kathmandu"],
      ["Bhutan", "Thimphu"],
      ["Thailand", "Bangkok"],
      ["Vietnam", "Hanoi"],
      ["Malaysia", "Kuala Lumpur"],
      ["Singapore", "Singapore"],
      ["Indonesia", "Jakarta"],
      ["Philippines", "Manila"],
      ["China", "Beijing"],
      ["South Korea", "Seoul"],
      ["Australia", "Canberra"],
      ["New Zealand", "Wellington"],
      ["Russia", "Moscow"],
      ["Ukraine", "Kyiv"],
      ["Poland", "Warsaw"],
      ["Greece", "Athens"],
      ["Sweden", "Stockholm"],
      ["Norway", "Oslo"],
      ["Finland", "Helsinki"],
      ["Denmark", "Copenhagen"],
      ["Netherlands", "Amsterdam"],
      ["Belgium", "Brussels"],
    ];

    const scienceFacts = [
      ["basic unit of life", "Cell"],
      ["powerhouse of the cell", "Mitochondria"],
      ["green pigment in plants", "Chlorophyll"],
      ["SI unit of force", "Newton"],
      ["SI unit of energy", "Joule"],
      ["SI unit of power", "Watt"],
      ["SI unit of frequency", "Hertz"],
      ["gas most abundant in Earth's atmosphere", "Nitrogen"],
      ["gas required for aerobic respiration", "Oxygen"],
      ["process plants use to make food", "Photosynthesis"],
      ["force that attracts objects toward Earth", "Gravity"],
      ["organ that filters waste from blood", "Kidney"],
      ["organ that pumps blood", "Heart"],
      ["basic unit of electric current", "Ampere"],
    ];

    const historyFacts = [
      ["leader associated with the Salt March", "Mahatma Gandhi"],
      ["author of India's national anthem", "Rabindranath Tagore"],
      ["author of Vande Mataram", "Bankim Chandra Chattopadhyay"],
      ["founder of the Maurya Empire", "Chandragupta Maurya"],
      ["ruler associated with the Kalinga War", "Ashoka"],
      ["founder of the Mughal Empire in India", "Babur"],
      ["first President of independent India", "Dr. Rajendra Prasad"],
      ["leader known for the slogan 'Jai Hind'", "Subhas Chandra Bose"],
    ];

    const geographyFacts = [
      ["largest continent", "Asia"],
      ["smallest continent", "Australia"],
      ["largest ocean", "Pacific Ocean"],
      ["deepest ocean trench", "Mariana Trench"],
      ["highest mountain", "Mount Everest"],
      ["largest hot desert", "Sahara Desert"],
      ["largest country by area", "Russia"],
      ["smallest country by area", "Vatican City"],
      ["longest river in India", "Ganga"],
      ["largest planet", "Jupiter"],
      ["planet known as the Red Planet", "Mars"],
      ["planet famous for its rings", "Saturn"],
    ];

    const variant =
      random.nextInt(0, 3);

    let items:
      | string[][]
      ;

    if (variant === 0) {
      items = scienceFacts;
    } else if (variant === 1) {
      items = historyFacts;
    } else if (variant === 2) {
      items = geographyFacts;
    } else {
      const item =
        countries[
          random.nextInt(
            0,
            countries.length - 1
          )
        ];

      const reverse =
        random.nextInt(0, 1);

      if (reverse === 0) {
        return makeChoice(
          localize(language, {
            en: `What is the capital of ${item[0]}?`,
            hi: `${item[0]} की राजधानी क्या है?`,
            or: `${item[0]} ରାଜଧାନୀ କଣ?`,
          }),
          item[1],
          countries.map(
            (entry) => entry[1]
          )
        );
      }

      return makeChoice(
        localize(language, {
          en: `${item[1]} is the capital of which country?`,
          hi: `${item[1]} किस देश की राजधानी है?`,
          or: `${item[1]} କେଉଁ ଦେଶର ରାଜଧାନୀ?`,
        }),
        item[0],
        countries.map(
          (entry) => entry[0]
        )
      );
    }

    const item =
      items[
        random.nextInt(
          0,
          items.length - 1
        )
      ];

    return makeChoice(
      localize(language, {
        en: `Which answer correctly matches "${item[0]}"?`,
        hi: `"${item[0]}" का सही उत्तर कौन सा है?`,
        or: `"${item[0]}" ର ସଠିକ ଉତ୍ତର କେଉଁଟି?`,
      }),
      item[1],
      items.map(
        (entry) => entry[1]
      )
    );
  }

  /*
   * ============================================================
   * CLASS 9–10
   * ============================================================
   */

  const countries = [
    ["India", "New Delhi"],
    ["Japan", "Tokyo"],
    ["France", "Paris"],
    ["Germany", "Berlin"],
    ["Italy", "Rome"],
    ["Spain", "Madrid"],
    ["Portugal", "Lisbon"],
    ["United Kingdom", "London"],
    ["Canada", "Ottawa"],
    ["United States", "Washington, D.C."],
    ["Mexico", "Mexico City"],
    ["Brazil", "Brasília"],
    ["Argentina", "Buenos Aires"],
    ["Chile", "Santiago"],
    ["Peru", "Lima"],
    ["Colombia", "Bogotá"],
    ["Egypt", "Cairo"],
    ["Kenya", "Nairobi"],
    ["Nigeria", "Abuja"],
    ["South Africa", "Pretoria"],
    ["Saudi Arabia", "Riyadh"],
    ["United Arab Emirates", "Abu Dhabi"],
    ["Turkey", "Ankara"],
    ["Iran", "Tehran"],
    ["Iraq", "Baghdad"],
    ["Pakistan", "Islamabad"],
    ["Bangladesh", "Dhaka"],
    ["Nepal", "Kathmandu"],
    ["Bhutan", "Thimphu"],
    ["Thailand", "Bangkok"],
    ["Vietnam", "Hanoi"],
    ["Malaysia", "Kuala Lumpur"],
    ["Singapore", "Singapore"],
    ["Indonesia", "Jakarta"],
    ["Philippines", "Manila"],
    ["China", "Beijing"],
    ["South Korea", "Seoul"],
    ["Australia", "Canberra"],
    ["New Zealand", "Wellington"],
    ["Russia", "Moscow"],
    ["Ukraine", "Kyiv"],
    ["Poland", "Warsaw"],
    ["Greece", "Athens"],
    ["Sweden", "Stockholm"],
    ["Norway", "Oslo"],
    ["Finland", "Helsinki"],
    ["Denmark", "Copenhagen"],
    ["Netherlands", "Amsterdam"],
    ["Belgium", "Brussels"],
  ];

  const scienceFacts = [
    ["SI unit of electric current", "Ampere"],
    ["SI unit of resistance", "Ohm"],
    ["SI unit of pressure", "Pascal"],
    ["SI unit of frequency", "Hertz"],
    ["SI unit of electric charge", "Coulomb"],
    ["basic unit of life", "Cell"],
    ["powerhouse of the cell", "Mitochondria"],
    ["green pigment in plants", "Chlorophyll"],
    ["gas required for combustion", "Oxygen"],
    ["most abundant gas in Earth's atmosphere", "Nitrogen"],
    ["SI unit of energy", "Joule"],
    ["SI unit of power", "Watt"],
  ];

  const historyFacts = [
    ["leader associated with the Salt March", "Mahatma Gandhi"],
    ["author of India's national anthem", "Rabindranath Tagore"],
    ["author of Vande Mataram", "Bankim Chandra Chattopadhyay"],
    ["founder of the Maurya Empire", "Chandragupta Maurya"],
    ["ruler associated with the Kalinga War", "Ashoka"],
    ["founder of the Mughal Empire in India", "Babur"],
    ["first President of independent India", "Dr. Rajendra Prasad"],
    ["leader associated with the Indian National Army", "Subhas Chandra Bose"],
  ];

  const civicsFacts = [
    ["lower house of the Parliament of India", "Lok Sabha"],
    ["upper house of the Parliament of India", "Rajya Sabha"],
    ["highest court of India", "Supreme Court"],
    ["document containing the fundamental law of India", "Constitution"],
    ["head of the Union executive in India", "President"],
    ["elected head of the Union government", "Prime Minister"],
  ];

  const geographyFacts = [
    ["largest continent", "Asia"],
    ["smallest continent", "Australia"],
    ["largest ocean", "Pacific Ocean"],
    ["deepest ocean trench", "Mariana Trench"],
    ["highest mountain above sea level", "Mount Everest"],
    ["largest hot desert", "Sahara Desert"],
    ["largest country by area", "Russia"],
    ["smallest country by area", "Vatican City"],
  ];

  const variant =
    random.nextInt(0, 4);

  if (variant === 0) {
    const item =
      scienceFacts[
        random.nextInt(
          0,
          scienceFacts.length - 1
        )
      ];

    return makeChoice(
      localize(language, {
        en: `Which term correctly matches "${item[0]}"?`,
        hi: `"${item[0]}" के लिए सही शब्द कौन सा है?`,
        or: `"${item[0]}" ପାଇଁ ସଠିକ ଶବ୍ଦ କେଉଁଟି?`,
      }),
      item[1],
      scienceFacts.map(
        (entry) => entry[1]
      )
    );
  }

  if (variant === 1) {
    const item =
      historyFacts[
        random.nextInt(
          0,
          historyFacts.length - 1
        )
      ];

    return makeChoice(
      localize(language, {
        en: `Who is associated with "${item[0]}"?`,
        hi: `"${item[0]}" से कौन जुड़ा है?`,
        or: `"${item[0]}" ସହିତ କିଏ ଜଡିତ?`,
      }),
      item[1],
      historyFacts.map(
        (entry) => entry[1]
      )
    );
  }

  if (variant === 2) {
    const item =
      civicsFacts[
        random.nextInt(
          0,
          civicsFacts.length - 1
        )
      ];

    return makeChoice(
      localize(language, {
        en: `Which answer correctly matches "${item[0]}"?`,
        hi: `"${item[0]}" के लिए सही उत्तर कौन सा है?`,
        or: `"${item[0]}" ପାଇଁ ସଠିକ ଉତ୍ତର କେଉଁଟି?`,
      }),
      item[1],
      civicsFacts.map(
        (entry) => entry[1]
      )
    );
  }

  if (variant === 3) {
    const item =
      geographyFacts[
        random.nextInt(
          0,
          geographyFacts.length - 1
        )
      ];

    return makeChoice(
      localize(language, {
        en: `Which answer correctly matches "${item[0]}"?`,
        hi: `"${item[0]}" के लिए सही उत्तर कौन सा है?`,
        or: `"${item[0]}" ପାଇଁ ସଠିକ ଉତ୍ତର କେଉଁଟି?`,
      }),
      item[1],
      geographyFacts.map(
        (entry) => entry[1]
      )
    );
  }

  const item =
    countries[
      random.nextInt(
        0,
        countries.length - 1
      )
    ];

  const reverse =
    random.nextInt(0, 1);

  if (reverse === 0) {
    return makeChoice(
      localize(language, {
        en: `What is the capital of ${item[0]}?`,
        hi: `${item[0]} की राजधानी क्या है?`,
        or: `${item[0]} ରାଜଧାନୀ କଣ?`,
      }),
      item[1],
      countries.map(
        (entry) => entry[1]
      )
    );
  }

  return makeChoice(
    localize(language, {
      en: `${item[1]} is the capital of which country?`,
      hi: `${item[1]} किस देश की राजधानी है?`,
      or: `${item[1]} କେଉଁ ଦେଶର ରାଜଧାନୀ?`,
    }),
    item[0],
    countries.map(
      (entry) => entry[0]
    )
  );
}

/*
 * ============================================================
 * ENGLISH
 * ============================================================
 */

const englishNouns = [
  "book",
  "apple",
  "school",
  "garden",
  "river",
  "teacher",
  "friend",
  "bird",
  "house",
  "flower",
  "computer",
  "market",
  "planet",
  "village",
  "table",
  "window",
];

const englishVerbs = [
  "play",
  "read",
  "write",
  "walk",
  "run",
  "jump",
  "sing",
  "eat",
  "watch",
  "help",
  "clean",
  "open",
];

const englishAdjectives = [
  "happy",
  "bright",
  "small",
  "large",
  "quick",
  "beautiful",
  "kind",
  "strong",
  "clean",
  "quiet",
  "brave",
  "smart",
];

const englishNames = [
  "Ravi",
  "Asha",
  "Neha",
  "Arjun",
  "Mina",
  "Kabir",
  "Anaya",
  "Rohan",
  "Sara",
  "Vikram",
];

const englishPluralPairs = [
  {
    singular: "book",
    plural: "books",
  },
  {
    singular: "apple",
    plural: "apples",
  },
  {
    singular: "flower",
    plural: "flowers",
  },
  {
    singular: "school",
    plural: "schools",
  },
  {
    singular: "river",
    plural: "rivers",
  },
  {
    singular: "teacher",
    plural: "teachers",
  },
  {
    singular: "friend",
    plural: "friends",
  },
  {
    singular: "bird",
    plural: "birds",
  },
  {
    singular: "computer",
    plural: "computers",
  },
  {
    singular: "market",
    plural: "markets",
  },
];

function generateEnglishQuestion(
  classLevel: ClassLevel,
  language: Language,
  seed: number
): QuizQuestion {
  const random =
    createSeededRandom(seed);

  const band =
    classBand(classLevel);

  function makeEnglishChoice(
    question: string,
    answer: string,
    wrongAnswers: string[]
  ): QuizQuestion {
    const result =
      makeOptions(
        answer,
        wrongAnswers,
        random
      );

    return makeQuestion(
      classLevel,
      language,
      "english",
      seed,
      question,
      result.options,
      result.correctIndex
    );
  }

  /*
   * ============================================================
   * KG1 / KG2
   * ============================================================
   */

  if (band === "early") {
    const alphabet = [
      ["A", "Apple"],
      ["B", "Ball"],
      ["C", "Cat"],
      ["D", "Dog"],
      ["E", "Egg"],
      ["F", "Fish"],
      ["G", "Goat"],
      ["H", "Hat"],
      ["I", "Ice"],
      ["J", "Jug"],
      ["K", "Kite"],
      ["L", "Lion"],
      ["M", "Mango"],
      ["N", "Nest"],
      ["O", "Orange"],
      ["P", "Parrot"],
      ["Q", "Queen"],
      ["R", "Rabbit"],
      ["S", "Sun"],
      ["T", "Tiger"],
      ["U", "Umbrella"],
      ["V", "Van"],
      ["W", "Watch"],
      ["X", "X-ray"],
      ["Y", "Yak"],
      ["Z", "Zebra"],
    ];

    const opposites = [
      ["big", "small"],
      ["hot", "cold"],
      ["up", "down"],
      ["in", "out"],
      ["open", "closed"],
      ["day", "night"],
      ["happy", "sad"],
      ["fast", "slow"],
      ["full", "empty"],
      ["tall", "short"],
      ["old", "young"],
      ["clean", "dirty"],
      ["near", "far"],
      ["light", "dark"],
      ["high", "low"],
    ];

    const colors = [
      "red",
      "blue",
      "green",
      "yellow",
      "orange",
      "purple",
      "pink",
      "black",
      "white",
      "brown",
    ];

    const bodyParts = [
      "head",
      "eyes",
      "ears",
      "nose",
      "mouth",
      "teeth",
      "hands",
      "legs",
      "feet",
      "hair",
    ];

    const variant =
      random.nextInt(0, 4);

    if (variant === 0) {
      const item =
        alphabet[
          random.nextInt(
            0,
            alphabet.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `Which word starts with the letter "${item[0]}"?`,
          hi: `"${item[0]}" अक्षर से कौन सा शब्द शुरू होता है?`,
          or: `"${item[0]}" ଅକ୍ଷରରେ କେଉଁ ଶବ୍ଦ ଆରମ୍ଭ ହୁଏ?`,
        }),
        item[1],
        alphabet
          .map((entry) => entry[1])
          .filter(
            (value) =>
              value !== item[1]
          )
          .slice(0, 8)
      );
    }

    if (variant === 1) {
      const item =
        alphabet[
          random.nextInt(
            0,
            alphabet.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `What is the first letter of "${item[1]}"?`,
          hi: `"${item[1]}" शब्द का पहला अक्षर क्या है?`,
          or: `"${item[1]}" ଶବ୍ଦର ପ୍ରଥମ ଅକ୍ଷର କଣ?`,
        }),
        item[0],
        alphabet.map(
          (entry) => entry[0]
        )
      );
    }

    if (variant === 2) {
      const item =
        opposites[
          random.nextInt(
            0,
            opposites.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `What is the opposite of "${item[0]}"?`,
          hi: `"${item[0]}" का विपरीत क्या है?`,
          or: `"${item[0]}" ର ବିପରୀତ ଶବ୍ଦ କଣ?`,
        }),
        item[1],
        opposites
          .map((entry) => entry[1])
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 3) {
      const bodyPart =
        bodyParts[
          random.nextInt(
            0,
            bodyParts.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `Which word names this body part: "${bodyPart}"?`,
          hi: `इस शरीर के अंग का अंग्रेज़ी शब्द क्या है: "${bodyPart}"?`,
          or: `ଏହି ଶରୀର ଅଂଶର ଇଂରାଜୀ ଶବ୍ଦ କଣ: "${bodyPart}"?`,
        }),
        bodyPart,
        bodyParts.filter(
          (value) =>
            value !== bodyPart
        )
      );
    }

    const color =
      colors[
        random.nextInt(
          0,
          colors.length - 1
        )
      ];

    return makeEnglishChoice(
      localize(language, {
        en: `Which word is the color "${color}"?`,
        hi: `"${color}" रंग का अंग्रेज़ी शब्द कौन सा है?`,
        or: `"${color}" ରଙ୍ଗର ଇଂରାଜୀ ଶବ୍ଦ କେଉଁଟି?`,
      }),
      color,
      colors.filter(
        (value) =>
          value !== color
      )
    );
  }

  /*
   * ============================================================
   * CLASS 1–3
   * ============================================================
   */

  if (band === "lower") {
    const nouns = [
      "book",
      "apple",
      "school",
      "garden",
      "river",
      "teacher",
      "friend",
      "bird",
      "house",
      "flower",
      "computer",
      "market",
      "village",
      "table",
      "window",
      "pencil",
      "tree",
      "car",
      "ball",
      "chair",
    ];

    const verbs = [
      "play",
      "read",
      "write",
      "walk",
      "run",
      "jump",
      "sing",
      "eat",
      "watch",
      "help",
      "clean",
      "open",
      "close",
      "cook",
      "dance",
      "swim",
      "draw",
      "climb",
    ];

    const adjectives = [
      "happy",
      "bright",
      "small",
      "large",
      "quick",
      "beautiful",
      "kind",
      "strong",
      "clean",
      "quiet",
      "brave",
      "smart",
      "cold",
      "hot",
      "young",
      "old",
      "tall",
      "short",
    ];

    const pluralPairs = [
      ["book", "books"],
      ["apple", "apples"],
      ["flower", "flowers"],
      ["school", "schools"],
      ["river", "rivers"],
      ["teacher", "teachers"],
      ["friend", "friends"],
      ["bird", "birds"],
      ["computer", "computers"],
      ["market", "markets"],
      ["car", "cars"],
      ["tree", "trees"],
      ["house", "houses"],
      ["chair", "chairs"],
      ["pencil", "pencils"],
    ];

    const pronounPeople = [
      ["Ravi", "he"],
      ["Arjun", "he"],
      ["Kabir", "he"],
      ["Rohan", "he"],
      ["Vikram", "he"],
      ["Asha", "she"],
      ["Neha", "she"],
      ["Mina", "she"],
      ["Anaya", "she"],
      ["Sara", "she"],
    ];

    const variant =
      random.nextInt(0, 5);

    if (variant === 0) {
      const noun =
        nouns[
          random.nextInt(
            0,
            nouns.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `Which word is a noun?`,
          hi: `कौन सा शब्द संज्ञा है?`,
          or: `କେଉଁ ଶବ୍ଦଟି ବିଶେଷ୍ୟ?`,
        }),
        noun,
        [
          random.pick(verbs),
          random.pick(adjectives),
          "quickly",
        ]
      );
    }

    if (variant === 1) {
      const verb =
        verbs[
          random.nextInt(
            0,
            verbs.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `Which word is a verb?`,
          hi: `कौन सा शब्द क्रिया है?`,
          or: `କେଉଁ ଶବ୍ଦଟି କ୍ରିୟା?`,
        }),
        verb,
        [
          random.pick(nouns),
          random.pick(adjectives),
          "quickly",
        ]
      );
    }

    if (variant === 2) {
      const adjective =
        adjectives[
          random.nextInt(
            0,
            adjectives.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `Which word is an adjective?`,
          hi: `कौन सा शब्द विशेषण है?`,
          or: `କେଉଁ ଶବ୍ଦଟି ବିଶେଷଣ?`,
        }),
        adjective,
        [
          random.pick(nouns),
          random.pick(verbs),
          "quickly",
        ]
      );
    }

    if (variant === 3) {
      const item =
        pluralPairs[
          random.nextInt(
            0,
            pluralPairs.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `What is the plural of "${item[0]}"?`,
          hi: `"${item[0]}" का बहुवचन क्या है?`,
          or: `"${item[0]}" ର ବହୁବଚନ କଣ?`,
        }),
        item[1],
        pluralPairs
          .map((entry) => entry[1])
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 4) {
      const item =
        pronounPeople[
          random.nextInt(
            0,
            pronounPeople.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `Which pronoun correctly replaces "${item[0]}"?`,
          hi: `"${item[0]}" के लिए सही pronoun कौन सा है?`,
          or: `"${item[0]}" ପାଇଁ ସଠିକ pronoun କେଉଁଟି?`,
        }),
        item[1],
        [
          "he",
          "she",
          "it",
          "they",
        ].filter(
          (value) =>
            value !== item[1]
        )
      );
    }

    const a =
      random.pick(nouns);

    const b =
      random.pick(nouns);

    return makeEnglishChoice(
      localize(language, {
        en: `Choose the correct sentence.`,
        hi: `सही वाक्य चुनें।`,
        or: `ସଠିକ ବାକ୍ୟଟି ବାଛ।`,
      }),
      `I have a ${a}.`,
      [
        `I has a ${a}.`,
        `I having a ${a}.`,
        `I have an ${b}.`,
      ]
    );
  }

  /*
   * ============================================================
   * CLASS 4–5
   * ============================================================
   */

  if (band === "middle") {
    const verbs = [
      ["play", "played"],
      ["walk", "walked"],
      ["jump", "jumped"],
      ["clean", "cleaned"],
      ["help", "helped"],
      ["open", "opened"],
      ["close", "closed"],
      ["watch", "watched"],
      ["start", "started"],
      ["paint", "painted"],
      ["wash", "washed"],
      ["cook", "cooked"],
      ["dance", "danced"],
      ["climb", "climbed"],
      ["visit", "visited"],
    ];

    const irregularVerbs = [
      ["go", "went"],
      ["come", "came"],
      ["eat", "ate"],
      ["drink", "drank"],
      ["run", "ran"],
      ["write", "wrote"],
      ["read", "read"],
      ["sing", "sang"],
      ["see", "saw"],
      ["take", "took"],
      ["give", "gave"],
      ["make", "made"],
      ["find", "found"],
      ["speak", "spoke"],
      ["begin", "began"],
    ];

    const comparatives = [
      ["tall", "taller"],
      ["small", "smaller"],
      ["large", "larger"],
      ["fast", "faster"],
      ["slow", "slower"],
      ["strong", "stronger"],
      ["bright", "brighter"],
      ["young", "younger"],
      ["old", "older"],
      ["short", "shorter"],
      ["long", "longer"],
      ["high", "higher"],
    ];

    const prepositions = [
      ["The book is ___ the table.", "on"],
      ["The cat is ___ the box.", "in"],
      ["The boy walked ___ the school.", "to"],
      ["The bird flew ___ the tree.", "over"],
      ["The shoes are ___ the bed.", "under"],
      ["The shop is ___ the bank.", "near"],
      ["Ravi sat ___ Asha.", "beside"],
      ["The ball is ___ the chair.", "behind"],
    ];

    const articles = [
      ["apple", "an"],
      ["orange", "an"],
      ["elephant", "an"],
      ["umbrella", "an"],
      ["egg", "an"],
      ["hour", "an"],
      ["book", "a"],
      ["car", "a"],
      ["dog", "a"],
      ["teacher", "a"],
      ["school", "a"],
      ["garden", "a"],
    ];

    const variant =
      random.nextInt(0, 4);

    if (variant === 0) {
      const item =
        verbs[
          random.nextInt(
            0,
            verbs.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `What is the past tense of "${item[0]}"?`,
          hi: `"${item[0]}" का भूतकाल क्या है?`,
          or: `"${item[0]}" ର ଅତୀତକାଳ କଣ?`,
        }),
        item[1],
        verbs
          .map((entry) => entry[1])
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 1) {
      const item =
        irregularVerbs[
          random.nextInt(
            0,
            irregularVerbs.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `What is the past tense of "${item[0]}"?`,
          hi: `"${item[0]}" का भूतकाल क्या है?`,
          or: `"${item[0]}" ର ଅତୀତକାଳ କଣ?`,
        }),
        item[1],
        irregularVerbs
          .map((entry) => entry[1])
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 2) {
      const item =
        comparatives[
          random.nextInt(
            0,
            comparatives.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `What is the comparative form of "${item[0]}"?`,
          hi: `"${item[0]}" का comparative form क्या है?`,
          or: `"${item[0]}" ର comparative form କଣ?`,
        }),
        item[1],
        comparatives
          .map((entry) => entry[1])
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 3) {
      const item =
        prepositions[
          random.nextInt(
            0,
            prepositions.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `Choose the correct preposition: ${item[0]}`,
          hi: `सही preposition चुनें: ${item[0]}`,
          or: `ସଠିକ preposition ବାଛ: ${item[0]}`,
        }),
        item[1],
        [
          "in",
          "on",
          "at",
          "under",
          "over",
          "behind",
          "near",
          "beside",
          "to",
        ].filter(
          (value) =>
            value !== item[1]
        )
      );
    }

    const item =
      articles[
        random.nextInt(
          0,
          articles.length - 1
        )
      ];

    return makeEnglishChoice(
      localize(language, {
        en: `Choose the correct article: ___ ${item[0]}.`,
        hi: `सही article चुनें: ___ ${item[0]}.`,
        or: `ସଠିକ article ବାଛ: ___ ${item[0]}.`,
      }),
      item[1],
      [
        "a",
        "an",
        "the",
        "no article",
      ].filter(
        (value) =>
          value !== item[1]
      )
    );
  }

  /*
   * ============================================================
   * CLASS 6–8
   * ============================================================
   */

  if (band === "upper") {
    const adjectives = [
      ["happy", "sad"],
      ["bright", "dark"],
      ["small", "large"],
      ["quick", "slow"],
      ["strong", "weak"],
      ["beautiful", "ugly"],
      ["kind", "unkind"],
      ["clean", "dirty"],
      ["quiet", "noisy"],
      ["brave", "cowardly"],
      ["smart", "foolish"],
      ["early", "late"],
    ];

    const synonyms = [
      ["happy", "joyful"],
      ["large", "big"],
      ["quick", "fast"],
      ["small", "little"],
      ["smart", "clever"],
      ["brave", "courageous"],
      ["kind", "gentle"],
      ["angry", "furious"],
      ["begin", "start"],
      ["finish", "complete"],
      ["help", "assist"],
      ["silent", "quiet"],
      ["beautiful", "lovely"],
      ["safe", "secure"],
    ];

    const nouns = [
      "book",
      "school",
      "teacher",
      "river",
      "garden",
      "computer",
      "market",
      "village",
      "mountain",
      "journey",
      "student",
      "friend",
      "library",
      "science",
      "planet",
      "forest",
    ];

    const verbs = [
      "read",
      "write",
      "play",
      "study",
      "visit",
      "watch",
      "help",
      "clean",
      "build",
      "carry",
      "learn",
      "travel",
      "paint",
      "solve",
    ];

    const names = [
      "Ravi",
      "Asha",
      "Neha",
      "Arjun",
      "Mina",
      "Kabir",
      "Anaya",
      "Rohan",
      "Sara",
      "Vikram",
    ];

    const variant =
      random.nextInt(0, 5);

    if (variant === 0) {
      const item =
        adjectives[
          random.nextInt(
            0,
            adjectives.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `Choose the opposite of "${item[0]}".`,
          hi: `"${item[0]}" का विलोम चुनें।`,
          or: `"${item[0]}" ର ବିପରୀତ ଶବ୍ଦ ବାଛ।`,
        }),
        item[1],
        adjectives
          .map((entry) => entry[1])
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 1) {
      const item =
        synonyms[
          random.nextInt(
            0,
            synonyms.length - 1
          )
        ];

      return makeEnglishChoice(
        localize(language, {
          en: `Choose a synonym of "${item[0]}".`,
          hi: `"${item[0]}" का समानार्थी शब्द चुनें।`,
          or: `"${item[0]}" ର ସମାର୍ଥକ ଶବ୍ଦ ବାଛ।`,
        }),
        item[1],
        synonyms
          .map((entry) => entry[1])
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 2) {
      const noun =
        random.pick(nouns);

      const verb =
        random.pick(verbs);

      const name =
        random.pick(names);

      return makeEnglishChoice(
        localize(language, {
          en: `Choose the grammatically correct sentence.`,
          hi: `व्याकरण की दृष्टि से सही वाक्य चुनें।`,
          or: `ବ୍ୟାକରଣ ଦୃଷ୍ଟିରୁ ସଠିକ ବାକ୍ୟ ବାଛ।`,
        }),
        `${name} ${verb}s in the ${noun}.`,
        [
          `${name} ${verb} in the ${noun}.`,
          `${name} ${verb}ing in the ${noun}.`,
          `${name} ${verb}ed in the ${noun}.`,
        ]
      );
    }

    if (variant === 3) {
      const name =
        random.pick(names);

      const noun =
        random.pick(nouns);

      return makeEnglishChoice(
        localize(language, {
          en: `Choose the correct possessive sentence.`,
          hi: `सही possessive वाक्य चुनें।`,
          or: `ସଠିକ possessive ବାକ୍ୟ ବାଛ।`,
        }),
        `${name}'s ${noun} is here.`,
        [
          `${name} ${noun} is here.`,
          `${name}s ${noun} is here.`,
          `${name} is ${noun}'s here.`,
        ]
      );
    }

    if (variant === 4) {
      const first =
        random.nextInt(10, 50);

      const second =
        random.nextInt(1, 9);

      const answer =
        String(
          first + second
        );

      return makeEnglishChoice(
        localize(language, {
          en: `Choose the sentence with the correct number: ${first} + ${second}.`,
          hi: `${first} + ${second} के लिए सही वाक्य चुनें।`,
          or: `${first} + ${second} ପାଇଁ ସଠିକ ବାକ୍ୟ ବାଛ।`,
        }),
        `The answer is ${answer}.`,
        [
          `The answer are ${answer}.`,
          `The answer is ${first - second}.`,
          `The answer are ${first + second + 1}.`,
        ]
      );
    }

    const noun =
      random.pick(nouns);

    const verb =
      random.pick(verbs);

    return makeEnglishChoice(
      localize(language, {
        en: `Which word is the noun in this phrase: "${noun} ${verb}"?`,
        hi: `इस phrase में noun कौन सा है: "${noun} ${verb}"?`,
        or: `ଏହି phrase ରେ noun କେଉଁଟି: "${noun} ${verb}"?`,
      }),
      noun,
      [
        verb,
        random.pick(adjectives)[0],
        "quickly",
      ]
    );
  }

  /*
   * ============================================================
   * CLASS 9–10
   * ============================================================
   */

  const advancedSynonyms = [
    ["abundant", "plentiful"],
    ["accurate", "exact"],
    ["ancient", "old"],
    ["brief", "short"],
    ["complex", "complicated"],
    ["essential", "necessary"],
    ["fortunate", "lucky"],
    ["obvious", "clear"],
    ["rapid", "fast"],
    ["reliable", "dependable"],
    ["similar", "alike"],
    ["sufficient", "enough"],
    ["vital", "important"],
    ["purchase", "buy"],
    ["assist", "help"],
  ];

  const advancedAntonyms = [
    ["ancient", "modern"],
    ["expand", "contract"],
    ["include", "exclude"],
    ["increase", "decrease"],
    ["major", "minor"],
    ["permanent", "temporary"],
    ["private", "public"],
    ["success", "failure"],
    ["visible", "invisible"],
    ["maximum", "minimum"],
    ["accept", "reject"],
    ["arrival", "departure"],
  ];

  const verbForms = [
    ["begin", "began", "begun"],
    ["break", "broke", "broken"],
    ["choose", "chose", "chosen"],
    ["drive", "drove", "driven"],
    ["eat", "ate", "eaten"],
    ["fall", "fell", "fallen"],
    ["forget", "forgot", "forgotten"],
    ["give", "gave", "given"],
    ["go", "went", "gone"],
    ["know", "knew", "known"],
    ["ride", "rode", "ridden"],
    ["see", "saw", "seen"],
    ["speak", "spoke", "spoken"],
    ["take", "took", "taken"],
    ["write", "wrote", "written"],
  ];

  const subjectVerbPairs = [
    ["He", "writes"],
    ["She", "reads"],
    ["Ravi", "plays"],
    ["Asha", "studies"],
    ["The boy", "runs"],
    ["The girl", "sings"],
    ["My brother", "works"],
    ["My sister", "dances"],
    ["The teacher", "explains"],
    ["The student", "answers"],
    ["The dog", "runs"],
    ["The bird", "flies"],
  ];

  const conjunctions = [
    ["I stayed home ___ it was raining.", "because"],
    ["Work hard ___ you will succeed.", "and"],
    ["Hurry up ___ you will miss the bus.", "or"],
    ["He is poor ___ honest.", "but"],
    ["She studied hard ___ she passed.", "so"],
    ["I will call you ___ I arrive.", "when"],
    ["Take an umbrella ___ it may rain.", "because"],
  ];

  const modals = [
    ["You ___ obey the rules.", "must"],
    ["___ I come in?", "May"],
    ["We ___ help our parents.", "should"],
    ["He ___ swim when he was five.", "could"],
    ["You ___ finish this today.", "must"],
    ["It ___ rain tonight.", "may"],
    ["Students ___ respect their teachers.", "should"],
  ];

  const variant =
    random.nextInt(0, 5);

  if (variant === 0) {
    const item =
      advancedSynonyms[
        random.nextInt(
          0,
          advancedSynonyms.length - 1
        )
      ];

    return makeEnglishChoice(
      localize(language, {
        en: `Choose a synonym of "${item[0]}".`,
        hi: `"${item[0]}" का समानार्थी शब्द चुनें।`,
        or: `"${item[0]}" ର ସମାର୍ଥକ ଶବ୍ଦ ବାଛ।`,
      }),
      item[1],
      advancedSynonyms
        .map((entry) => entry[1])
        .filter(
          (value) =>
            value !== item[1]
        )
    );
  }

  if (variant === 1) {
    const item =
      advancedAntonyms[
        random.nextInt(
          0,
          advancedAntonyms.length - 1
        )
      ];

    return makeEnglishChoice(
      localize(language, {
        en: `Choose the antonym of "${item[0]}".`,
        hi: `"${item[0]}" का विलोम शब्द चुनें।`,
        or: `"${item[0]}" ର ବିପରୀତ ଶବ୍ଦ ବାଛ।`,
      }),
      item[1],
      advancedAntonyms
        .map((entry) => entry[1])
        .filter(
          (value) =>
            value !== item[1]
        )
    );
  }

  if (variant === 2) {
    const item =
      verbForms[
        random.nextInt(
          0,
          verbForms.length - 1
        )
      ];

    const form =
      random.nextInt(0, 2);

    if (form === 0) {
      return makeEnglishChoice(
        localize(language, {
          en: `What is the past tense of "${item[0]}"?`,
          hi: `"${item[0]}" का past tense क्या है?`,
          or: `"${item[0]}" ର past tense କଣ?`,
        }),
        item[1],
        verbForms.map(
          (entry) => entry[1]
        )
      );
    }

    if (form === 1) {
      return makeEnglishChoice(
        localize(language, {
          en: `What is the past participle of "${item[0]}"?`,
          hi: `"${item[0]}" का past participle क्या है?`,
          or: `"${item[0]}" ର past participle କଣ?`,
        }),
        item[2],
        verbForms.map(
          (entry) => entry[2]
        )
      );
    }

    return makeEnglishChoice(
      localize(language, {
        en: `Which verb has "${item[2]}" as its past participle?`,
        hi: `"${item[2]}" past participle किस verb का है?`,
        or: `"${item[2]}" କେଉଁ verb ର past participle?`,
      }),
      item[0],
      verbForms.map(
        (entry) => entry[0]
      )
    );
  }

  if (variant === 3) {
    const item =
      subjectVerbPairs[
        random.nextInt(
          0,
          subjectVerbPairs.length - 1
        )
      ];

    return makeEnglishChoice(
      localize(language, {
        en: `Choose the grammatically correct form: "${item[0]} ___ every day."`,
        hi: `सही व्याकरण वाला रूप चुनें: "${item[0]} ___ every day."`,
        or: `ସଠିକ ବ୍ୟାକରଣ ରୂପ ବାଛ: "${item[0]} ___ every day."`,
      }),
      item[1],
      subjectVerbPairs
        .map((entry) => entry[1])
        .filter(
          (value) =>
            value !== item[1]
        )
    );
  }

  if (variant === 4) {
    const item =
      conjunctions[
        random.nextInt(
          0,
          conjunctions.length - 1
        )
      ];

    return makeEnglishChoice(
      localize(language, {
        en: `Choose the correct conjunction: ${item[0]}`,
        hi: `सही conjunction चुनें: ${item[0]}`,
        or: `ସଠିକ conjunction ବାଛ: ${item[0]}`,
      }),
      item[1],
      [
        "and",
        "but",
        "because",
        "or",
        "so",
        "when",
      ].filter(
        (value) =>
          value !== item[1]
      )
    );
  }

  const item =
    modals[
      random.nextInt(
        0,
        modals.length - 1
      )
    ];

  return makeEnglishChoice(
    localize(language, {
      en: `Choose the correct modal: ${item[0]}`,
      hi: `सही modal चुनें: ${item[0]}`,
      or: `ସଠିକ modal ବାଛ: ${item[0]}`,
    }),
    item[1],
    [
      "can",
      "could",
      "may",
      "might",
      "must",
      "should",
      "would",
    ].filter(
      (value) =>
        value !== item[1]
    )
  );
}

/*
 * ============================================================
 * EVS
 * ============================================================
 */

const evsPeoplePlaces: Array<{
  person: string;
  place: string;
}> = [
  {
    person: "doctor",
    place: "hospital",
  },
  {
    person: "teacher",
    place: "school",
  },
  {
    person: "farmer",
    place: "farm",
  },
  {
    person: "police officer",
    place: "police station",
  },
  {
    person: "post worker",
    place: "post office",
  },
  {
    person: "shopkeeper",
    place: "market",
  },
  {
    person: "nurse",
    place: "hospital",
  },
  {
    person: "librarian",
    place: "library",
  },
];

const evsFoods = [
  "fruit",
  "vegetables",
  "milk",
  "dal",
  "rice",
  "roti",
  "nuts",
];

const evsTransport = [
  "bus",
  "train",
  "bicycle",
  "boat",
  "car",
  "airplane",
];

const evsRecyclables = [
  "paper",
  "cardboard",
  "metal can",
  "glass bottle",
  "plastic bottle",
];

function generateEVSQuestion(
  classLevel: ClassLevel,
  language: Language,
  seed: number
): QuizQuestion {
  const random =
    createSeededRandom(seed);

  const band =
    classBand(classLevel);

  function makeEVSChoice(
    question: string,
    answer: string,
    wrongAnswers: string[]
  ): QuizQuestion {
    const result =
      makeOptions(
        answer,
        wrongAnswers,
        random
      );

    return makeQuestion(
      classLevel,
      language,
      "evs",
      seed,
      question,
      result.options,
      result.correctIndex
    );
  }

  /*
   * ============================================================
   * KG1 / KG2
   * ============================================================
   */

  if (band === "early") {
    const bodyParts = [
      ["see", "Eyes"],
      ["hear", "Ears"],
      ["smell", "Nose"],
      ["taste", "Tongue"],
      ["chew", "Teeth"],
      ["walk", "Legs"],
      ["hold things", "Hands"],
      ["kick a ball", "Feet"],
    ];

    const healthyHabits = [
      "wash hands",
      "brush teeth",
      "eat fruits",
      "drink clean water",
      "sleep on time",
      "keep the room clean",
      "exercise",
      "eat vegetables",
    ];

    const unsafeHabits = [
      "touch a hot stove",
      "play with sharp objects",
      "drink dirty water",
      "throw waste on the road",
      "cross the road without looking",
      "play near open fire",
    ];

    const transport = [
      "bus",
      "car",
      "train",
      "bicycle",
      "boat",
      "airplane",
      "auto-rickshaw",
      "scooter",
    ];

    const animals = [
      ["dog", "home"],
      ["cow", "farm"],
      ["horse", "stable"],
      ["fish", "water"],
      ["bird", "nest"],
      ["bee", "hive"],
      ["lion", "forest"],
      ["rabbit", "burrow"],
      ["hen", "coop"],
      ["sheep", "farm"],
    ];

    const cleanThings = [
      "put waste in a bin",
      "wash hands",
      "keep water covered",
      "clean the classroom",
      "keep toys in their place",
      "use a clean plate",
      "use a handkerchief",
    ];

    const variant =
      random.nextInt(0, 5);

    if (variant === 0) {
      const item =
        bodyParts[
          random.nextInt(
            0,
            bodyParts.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Which body part do we use to ${item[0]}?`,
          hi: `${item[0]} के लिए हम किस अंग का उपयोग करते हैं?`,
          or: `${item[0]} ପାଇଁ ଆମେ କେଉଁ ଅଙ୍ଗ ବ୍ୟବହାର କରୁ?`,
        }),
        item[1],
        bodyParts
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 1) {
      const habit =
        healthyHabits[
          random.nextInt(
            0,
            healthyHabits.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Which habit helps us stay healthy?`,
          hi: `कौन सी आदत हमें स्वस्थ रखने में मदद करती है?`,
          or: `କେଉଁ ଅଭ୍ୟାସ ଆମକୁ ସୁସ୍ଥ ରଖେ?`,
        }),
        habit,
        [
          "drink dirty water",
          "skip brushing teeth",
          "throw waste on the road",
          "stay awake all night",
        ]
      );
    }

    if (variant === 2) {
      const unsafe =
        unsafeHabits[
          random.nextInt(
            0,
            unsafeHabits.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Which action is unsafe?`,
          hi: `इनमें से कौन सा काम असुरक्षित है?`,
          or: `ଏଥିରୁ କେଉଁ କାର୍ଯ୍ୟ ଅସୁରକ୍ଷିତ?`,
        }),
        unsafe,
        [
          ...cleanThings.slice(0, 3),
        ]
      );
    }

    if (variant === 3) {
      const vehicle =
        transport[
          random.nextInt(
            0,
            transport.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Which one is a means of transport?`,
          hi: `इनमें से परिवहन का साधन कौन सा है?`,
          or: `ଏଥିରୁ କେଉଁଟି ପରିବହନ ମାଧ୍ୟମ?`,
        }),
        vehicle,
        [
          "chair",
          "table",
          "pencil",
        ]
      );
    }

    if (variant === 4) {
      const item =
        animals[
          random.nextInt(
            0,
            animals.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Where does a ${item[0]} usually live?`,
          hi: `${item[0]} सामान्यतः कहाँ रहता है?`,
          or: `${item[0]} ସାଧାରଣତଃ କେଉଁଠି ରହେ?`,
        }),
        item[1],
        animals
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    const cleanThing =
      cleanThings[
        random.nextInt(
          0,
          cleanThings.length - 1
        )
      ];

    return makeEVSChoice(
      localize(language, {
        en: `Which action helps keep our surroundings clean?`,
        hi: `कौन सा काम हमारे आसपास को साफ रखने में मदद करता है?`,
        or: `କେଉଁ କାର୍ଯ୍ୟ ଆମ ପରିବେଶକୁ ସଫା ରଖିବାରେ ସାହାଯ୍ୟ କରେ?`,
      }),
      cleanThing,
      [
        "throw waste on the road",
        "leave food on the floor",
        "spill water everywhere",
      ]
    );
  }

  /*
   * ============================================================
   * CLASS 1–3
   * ============================================================
   */

  if (band === "lower") {
    const foodGroups = [
      ["apple", "fruit"],
      ["banana", "fruit"],
      ["mango", "fruit"],
      ["carrot", "vegetable"],
      ["spinach", "vegetable"],
      ["potato", "vegetable"],
      ["rice", "grain"],
      ["wheat", "grain"],
      ["dal", "pulse"],
      ["milk", "dairy"],
      ["curd", "dairy"],
      ["cheese", "dairy"],
    ];

    const occupations = [
      ["doctor", "hospital"],
      ["teacher", "school"],
      ["farmer", "farm"],
      ["police officer", "police station"],
      ["firefighter", "fire station"],
      ["librarian", "library"],
      ["post worker", "post office"],
      ["shopkeeper", "shop"],
      ["pilot", "airport"],
      ["chef", "kitchen"],
      ["mechanic", "garage"],
      ["nurse", "hospital"],
    ];

    const naturalResources = [
      "water",
      "air",
      "sunlight",
      "soil",
      "trees",
      "plants",
    ];

    const wasteTypes = [
      ["banana peel", "organic"],
      ["vegetable scraps", "organic"],
      ["paper", "recyclable"],
      ["cardboard", "recyclable"],
      ["plastic bottle", "recyclable"],
      ["glass bottle", "recyclable"],
      ["metal can", "recyclable"],
      ["dry leaves", "organic"],
    ];

    const seasons = [
      ["hot", "summer"],
      ["cold", "winter"],
      ["rainy", "monsoon"],
      ["flowers bloom", "spring"],
    ];

    const waterUses = [
      "drinking",
      "cooking",
      "washing",
      "bathing",
      "watering plants",
      "cleaning",
    ];

    const variant =
      random.nextInt(0, 5);

    if (variant === 0) {
      const item =
        foodGroups[
          random.nextInt(
            0,
            foodGroups.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Which food group does ${item[0]} belong to?`,
          hi: `${item[0]} किस खाद्य समूह में आता है?`,
          or: `${item[0]} କେଉଁ ଖାଦ୍ୟ ଗୋଷ୍ଠୀରେ ପଡ଼େ?`,
        }),
        item[1],
        foodGroups
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 1) {
      const item =
        occupations[
          random.nextInt(
            0,
            occupations.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Where does a ${item[0]} usually work?`,
          hi: `${item[0]} सामान्यतः कहाँ काम करता/करती है?`,
          or: `${item[0]} ସାଧାରଣତଃ କେଉଁଠି କାମ କରନ୍ତି?`,
        }),
        item[1],
        occupations
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 2) {
      const item =
        naturalResources[
          random.nextInt(
            0,
            naturalResources.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Which one is a natural resource?`,
          hi: `इनमें से कौन सा प्राकृतिक संसाधन है?`,
          or: `ଏଥିରୁ କେଉଁଟି ପ୍ରାକୃତିକ ସମ୍ପଦ?`,
        }),
        item,
        [
          "plastic",
          "glass",
          "rubber",
          "metal",
        ]
      );
    }

    if (variant === 3) {
      const item =
        wasteTypes[
          random.nextInt(
            0,
            wasteTypes.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `How should ${item[0]} usually be classified?`,
          hi: `${item[0]} को सामान्यतः कैसे वर्गीकृत किया जाता है?`,
          or: `${item[0]} କୁ ସାଧାରଣତଃ କିପରି ବର୍ଗୀକରଣ କରାଯାଏ?`,
        }),
        item[1],
        [
          "organic",
          "recyclable",
          "liquid",
          "metal",
        ].filter(
          (value) =>
            value !== item[1]
        )
      );
    }

    if (variant === 4) {
      const item =
        seasons[
          random.nextInt(
            0,
            seasons.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Which season is usually associated with ${item[0]} weather?`,
          hi: `${item[0]} मौसम सामान्यतः किस ऋतु से जुड़ा है?`,
          or: `${item[0]} ପାଗ ସାଧାରଣତଃ କେଉଁ ଋତୁ ସହିତ ଜଡିତ?`,
        }),
        item[1],
        seasons
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    const use =
      waterUses[
        random.nextInt(
          0,
          waterUses.length - 1
        )
      ];

    return makeEVSChoice(
      localize(language, {
        en: `Which is a useful way to use water?`,
        hi: `पानी का उपयोग करने का उपयोगी तरीका कौन सा है?`,
        or: `ପାଣି ବ୍ୟବହାର କରିବାର ଉପଯୋଗୀ ଉପାୟ କେଉଁଟି?`,
      }),
      use,
      [
        "waste water",
        "leave the tap running",
        "pollute a river",
      ]
    );
  }

  /*
   * ============================================================
   * CLASS 4–5
   * ============================================================
   */

  if (band === "middle") {
    const naturalResources = [
      ["water", "used for drinking"],
      ["soil", "used for growing crops"],
      ["sunlight", "provides solar energy"],
      ["wind", "can generate energy"],
      ["trees", "provide oxygen and useful products"],
      ["air", "needed for breathing"],
      ["minerals", "used in many materials"],
    ];

    const pollution = [
      ["smoke from vehicles", "air pollution"],
      ["plastic dumped in a river", "water pollution"],
      ["loud horns", "noise pollution"],
      ["factory smoke", "air pollution"],
      ["sewage in a river", "water pollution"],
      ["loudspeakers at very high volume", "noise pollution"],
      ["burning waste", "air pollution"],
      ["oil spilled into water", "water pollution"],
    ];

    const conservation = [
      ["turning off unused lights", "save electricity"],
      ["closing the tap", "save water"],
      ["planting trees", "protect the environment"],
      ["using both sides of paper", "reduce paper waste"],
      ["reusing containers", "reduce waste"],
      ["walking for short trips", "reduce fuel use"],
      ["using public transport", "reduce fuel use"],
      ["separating waste", "support recycling"],
    ];

    const foodSources = [
      ["rice", "plant"],
      ["wheat", "plant"],
      ["mango", "plant"],
      ["carrot", "plant"],
      ["milk", "animal"],
      ["egg", "animal"],
      ["honey", "animal"],
      ["curd", "animal"],
    ];

    const communityPlaces = [
      ["hospital", "treat sick people"],
      ["school", "learn"],
      ["library", "read books"],
      ["police station", "seek police help"],
      ["fire station", "firefighters work"],
      ["post office", "send letters and parcels"],
      ["bank", "manage money"],
      ["market", "buy goods"],
    ];

    const directions = [
      ["sunrise", "East"],
      ["sunset", "West"],
      ["top of a map", "North"],
      ["bottom of a map", "South"],
    ];

    const variant =
      random.nextInt(0, 5);

    if (variant === 0) {
      const item =
        naturalResources[
          random.nextInt(
            0,
            naturalResources.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Why is ${item[0]} useful?`,
          hi: `${item[0]} उपयोगी क्यों है?`,
          or: `${item[0]} କାହିଁକି ଉପଯୋଗୀ?`,
        }),
        item[1],
        naturalResources
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 1) {
      const item =
        pollution[
          random.nextInt(
            0,
            pollution.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `What type of pollution can be caused by ${item[0]}?`,
          hi: `${item[0]} से किस प्रकार का प्रदूषण हो सकता है?`,
          or: `${item[0]} ଦ୍ୱାରା କେଉଁ ପ୍ରକାର ପ୍ରଦୂଷଣ ହୋଇପାରେ?`,
        }),
        item[1],
        [
          "air pollution",
          "water pollution",
          "noise pollution",
          "soil pollution",
        ].filter(
          (value) =>
            value !== item[1]
        )
      );
    }

    if (variant === 2) {
      const item =
        conservation[
          random.nextInt(
            0,
            conservation.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Which action helps us ${item[1]}?`,
          hi: `${item[1]} में कौन सा काम मदद करता है?`,
          or: `${item[1]} ପାଇଁ କେଉଁ କାର୍ଯ୍ୟ ସାହାଯ୍ୟ କରେ?`,
        }),
        item[0],
        conservation
          .map(
            (entry) => entry[0]
          )
          .filter(
            (value) =>
              value !== item[0]
          )
      );
    }

    if (variant === 3) {
      const item =
        foodSources[
          random.nextInt(
            0,
            foodSources.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Where does ${item[0]} mainly come from?`,
          hi: `${item[0]} मुख्य रूप से कहाँ से आता है?`,
          or: `${item[0]} ମୁଖ୍ୟତଃ କେଉଁଠାରୁ ଆସେ?`,
        }),
        item[1],
        ["plant", "animal", "mineral"].filter(
          (value) =>
            value !== item[1]
        )
      );
    }

    if (variant === 4) {
      const item =
        communityPlaces[
          random.nextInt(
            0,
            communityPlaces.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `What do people usually do at a ${item[0]}?`,
          hi: `${item[0]} में लोग सामान्यतः क्या करते हैं?`,
          or: `${item[0]} ରେ ଲୋକମାନେ ସାଧାରଣତଃ କଣ କରନ୍ତି?`,
        }),
        item[1],
        communityPlaces
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    const item =
      directions[
        random.nextInt(
          0,
          directions.length - 1
        )
      ];

    return makeEVSChoice(
      localize(language, {
        en: `Which direction is associated with ${item[0]}?`,
        hi: `${item[0]} से कौन सी दिशा जुड़ी है?`,
        or: `${item[0]} ସହିତ କେଉଁ ଦିଗ ଜଡିତ?`,
      }),
      item[1],
      [
        "North",
        "South",
        "East",
        "West",
      ].filter(
        (value) =>
          value !== item[1]
      )
    );
  }

  /*
   * ============================================================
   * CLASS 6–8
   * ============================================================
   */

  if (band === "upper") {
    const agriculture = [
      ["crop rotation", "helps maintain soil fertility"],
      ["irrigation", "supplies water to crops"],
      ["manure", "adds organic matter to soil"],
      ["fertilizer", "provides nutrients to crops"],
      ["weeding", "removes unwanted plants"],
      ["sowing", "placing seeds in soil"],
      ["harvesting", "collecting mature crops"],
      ["storage", "protecting harvested crops"],
    ];

    const environment = [
      ["deforestation", "loss of forest cover"],
      ["afforestation", "planting trees"],
      ["recycling", "processing waste into useful material"],
      ["composting", "turning organic waste into manure"],
      ["rainwater harvesting", "collecting rainwater"],
      ["wildlife conservation", "protecting wild animals"],
      ["soil conservation", "preventing soil loss"],
      ["water conservation", "reducing unnecessary water use"],
    ];

    const resources = [
      ["solar energy", "renewable"],
      ["wind energy", "renewable"],
      ["hydropower", "renewable"],
      ["coal", "non-renewable"],
      ["petroleum", "non-renewable"],
      ["natural gas", "non-renewable"],
      ["biomass", "renewable"],
      ["geothermal energy", "renewable"],
    ];

    const disasters = [
      ["earthquake", "sudden shaking of the ground"],
      ["flood", "overflow of water onto normally dry land"],
      ["drought", "long period with very little rainfall"],
      ["cyclone", "large rotating storm"],
      ["landslide", "movement of soil and rock down a slope"],
      ["tsunami", "large sea waves caused by undersea disturbances"],
    ];

    const communityHealth = [
      ["boiling drinking water", "reduces many harmful germs"],
      ["washing hands", "helps prevent spread of germs"],
      ["proper waste disposal", "keeps surroundings cleaner"],
      ["vaccination", "helps protect against some diseases"],
      ["balanced diet", "provides different nutrients"],
      ["regular exercise", "helps maintain fitness"],
    ];

    const seasons = [
      ["summer", "higher temperatures"],
      ["winter", "lower temperatures"],
      ["monsoon", "frequent rainfall"],
      ["spring", "milder weather and flowering"],
      ["autumn", "cooler weather in many regions"],
    ];

    const variant =
      random.nextInt(0, 5);

    if (variant === 0) {
      const item =
        agriculture[
          random.nextInt(
            0,
            agriculture.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `What is the main purpose of ${item[0]}?`,
          hi: `${item[0]} का मुख्य उद्देश्य क्या है?`,
          or: `${item[0]} ର ମୁଖ୍ୟ ଉଦ୍ଦେଶ୍ୟ କଣ?`,
        }),
        item[1],
        agriculture
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 1) {
      const item =
        environment[
          random.nextInt(
            0,
            environment.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Which statement best describes ${item[0]}?`,
          hi: `${item[0]} का सबसे सही वर्णन कौन सा है?`,
          or: `${item[0]} କୁ ସବୁଠାରୁ ଭଲ ଭାବେ କେଉଁ ବାକ୍ୟ ବର୍ଣ୍ଣନା କରେ?`,
        }),
        item[1],
        environment
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 2) {
      const item =
        resources[
          random.nextInt(
            0,
            resources.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `How is ${item[0]} classified?`,
          hi: `${item[0]} को किस प्रकार वर्गीकृत किया जाता है?`,
          or: `${item[0]} କିପରି ବର୍ଗୀକୃତ ହୁଏ?`,
        }),
        item[1],
        [
          "renewable",
          "non-renewable",
        ].filter(
          (value) =>
            value !== item[1]
        )
      );
    }

    if (variant === 3) {
      const item =
        disasters[
          random.nextInt(
            0,
            disasters.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Which description matches a ${item[0]}?`,
          hi: `${item[0]} का सही वर्णन कौन सा है?`,
          or: `${item[0]} ର ସଠିକ ବର୍ଣ୍ଣନା କେଉଁଟି?`,
        }),
        item[1],
        disasters
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    if (variant === 4) {
      const item =
        communityHealth[
          random.nextInt(
            0,
            communityHealth.length - 1
          )
        ];

      return makeEVSChoice(
        localize(language, {
          en: `Why is ${item[0]} useful?`,
          hi: `${item[0]} क्यों उपयोगी है?`,
          or: `${item[0]} କାହିଁକି ଉପଯୋଗୀ?`,
        }),
        item[1],
        communityHealth
          .map(
            (entry) => entry[1]
          )
          .filter(
            (value) =>
              value !== item[1]
          )
      );
    }

    const item =
      seasons[
        random.nextInt(
          0,
          seasons.length - 1
        )
      ];

    return makeEVSChoice(
      localize(language, {
        en: `Which feature is commonly associated with ${item[0]}?`,
        hi: `${item[0]} से सामान्यतः कौन सी विशेषता जुड़ी है?`,
        or: `${item[0]} ସହିତ ସାଧାରଣତଃ କେଉଁ ବିଶେଷତା ଜଡିତ?`,
      }),
      item[1],
      seasons
        .map(
          (entry) => entry[1]
        )
        .filter(
          (value) =>
            value !== item[1]
        )
    );
  }

  /*
   * ============================================================
   * CLASS 9–10
   * ============================================================
   */

  const sustainability = [
    ["solar energy", "renewable energy"],
    ["wind energy", "renewable energy"],
    ["hydropower", "renewable energy"],
    ["coal", "fossil fuel"],
    ["petroleum", "fossil fuel"],
    ["natural gas", "fossil fuel"],
    ["biogas", "renewable energy"],
    ["geothermal energy", "renewable energy"],
  ];

  const pollution = [
    ["vehicle exhaust", "air pollution"],
    ["industrial smoke", "air pollution"],
    ["untreated sewage", "water pollution"],
    ["oil spills", "water pollution"],
    ["excessive traffic horns", "noise pollution"],
    ["construction noise", "noise pollution"],
    ["open burning of waste", "air pollution"],
    ["plastic waste in rivers", "water pollution"],
  ];

  const agriculture = [
    ["drip irrigation", "reduces water loss"],
    ["crop rotation", "helps maintain soil fertility"],
    ["organic manure", "adds organic matter to soil"],
    ["contour ploughing", "helps reduce soil erosion"],
    ["terracing", "slows water runoff on slopes"],
    ["mulching", "helps conserve soil moisture"],
    ["mixed cropping", "can reduce risk from crop failure"],
    ["rainwater harvesting", "collects water for later use"],
  ];

  const disasterManagement = [
    ["earthquake", "drop, cover and hold"],
    ["flood", "move to higher ground"],
    ["cyclone", "follow official evacuation instructions"],
    ["landslide", "move away from unstable slopes"],
    ["lightning storm", "seek shelter indoors"],
    ["heat wave", "drink water and avoid peak heat"],
  ];

  const conservationMethods = [
    ["recycling paper", "reduces demand for new paper"],
    ["using public transport", "reduces fuel use per person"],
    ["planting trees", "increases vegetation cover"],
    ["using efficient appliances", "can reduce electricity consumption"],
    ["repairing and reusing items", "reduces waste"],
    ["rainwater harvesting", "increases water availability"],
    ["protecting wetlands", "supports ecosystems"],
    ["reducing single-use plastic", "reduces plastic waste"],
  ];

  const humanEnvironment = [
    ["urbanisation", "growth of towns and cities"],
    ["deforestation", "removal of forest cover"],
    ["industrialisation", "growth of industries"],
    ["migration", "movement of people from one place to another"],
    ["irrigation", "artificial supply of water to crops"],
    ["sanitation", "systems for safe disposal of waste and sewage"],
  ];

  const variant =
    random.nextInt(0, 5);

  if (variant === 0) {
    const item =
      sustainability[
        random.nextInt(
          0,
          sustainability.length - 1
        )
      ];

    return makeEVSChoice(
      localize(language, {
        en: `How is ${item[0]} best classified?`,
        hi: `${item[0]} को किस प्रकार वर्गीकृत करना सबसे सही है?`,
        or: `${item[0]} କିପରି ବର୍ଗୀକୃତ କରିବା ସବୁଠାରୁ ଠିକ?`,
      }),
      item[1],
      [
        "renewable energy",
        "fossil fuel",
        "non-renewable mineral",
      ].filter(
        (value) =>
          value !== item[1]
      )
    );
  }

  if (variant === 1) {
    const item =
      pollution[
        random.nextInt(
          0,
          pollution.length - 1
        )
      ];

    return makeEVSChoice(
      localize(language, {
        en: `What type of pollution is most directly associated with ${item[0]}?`,
        hi: `${item[0]} से सबसे सीधे किस प्रकार का प्रदूषण जुड़ा है?`,
        or: `${item[0]} ସହିତ ସବୁଠାରୁ ସିଧାସଳଖ କେଉଁ ପ୍ରକାର ପ୍ରଦୂଷଣ ଜଡିତ?`,
      }),
      item[1],
      [
        "air pollution",
        "water pollution",
        "noise pollution",
        "soil pollution",
      ].filter(
        (value) =>
          value !== item[1]
      )
    );
  }

  if (variant === 2) {
    const item =
      agriculture[
        random.nextInt(
          0,
          agriculture.length - 1
        )
      ];

    return makeEVSChoice(
      localize(language, {
        en: `What is one important benefit of ${item[0]}?`,
        hi: `${item[0]} का एक महत्वपूर्ण लाभ क्या है?`,
        or: `${item[0]} ର ଗୋଟିଏ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଲାଭ କଣ?`,
      }),
      item[1],
      agriculture
        .map(
          (entry) => entry[1]
        )
        .filter(
          (value) =>
            value !== item[1]
        )
    );
  }

  if (variant === 3) {
    const item =
      disasterManagement[
        random.nextInt(
          0,
          disasterManagement.length - 1
        )
      ];

    return makeEVSChoice(
      localize(language, {
        en: `What is an appropriate safety action during a ${item[0]}?`,
        hi: `${item[0]} के दौरान कौन सा सुरक्षा उपाय उचित है?`,
        or: `${item[0]} ସମୟରେ କେଉଁ ସୁରକ୍ଷା ପଦକ୍ଷେପ ଉଚିତ?`,
      }),
      item[1],
      disasterManagement
        .map(
          (entry) => entry[1]
        )
        .filter(
          (value) =>
            value !== item[1]
        )
    );
  }

  if (variant === 4) {
    const item =
      conservationMethods[
        random.nextInt(
          0,
          conservationMethods.length - 1
        )
      ];

    return makeEVSChoice(
      localize(language, {
        en: `What is a likely environmental benefit of ${item[0]}?`,
        hi: `${item[0]} का संभावित पर्यावरणीय लाभ क्या है?`,
        or: `${item[0]} ର ସମ୍ଭାବ୍ୟ ପରିବେଶୀୟ ଲାଭ କଣ?`,
      }),
      item[1],
      conservationMethods
        .map(
          (entry) => entry[1]
        )
        .filter(
          (value) =>
            value !== item[1]
        )
    );
  }

  const item =
    humanEnvironment[
      random.nextInt(
        0,
        humanEnvironment.length - 1
      )
    ];

  return makeEVSChoice(
    localize(language, {
      en: `Which statement best describes ${item[0]}?`,
      hi: `${item[0]} का सबसे सही वर्णन कौन सा है?`,
      or: `${item[0]} ର ସବୁଠାରୁ ଭଲ ବର୍ଣ୍ଣନା କେଉଁଟି?`,
    }),
    item[1],
    humanEnvironment
      .map(
        (entry) => entry[1]
      )
      .filter(
        (value) =>
          value !== item[1]
      )
  );
}

/*
 * ============================================================
 * GENERIC DYNAMIC GENERATOR
 * ============================================================
 */

export function generateDynamicQuestion(
  classLevel: ClassLevel,
  language: Language,
  subject: Subject,
  seed: number
): QuizQuestion {
  switch (
    normalizeSubject(subject)
  ) {
    case "mathematics":
      return generateMathQuestion(
        classLevel,
        language,
        seed
      );

    case "science":
      return generateScienceQuestion(
        classLevel,
        language,
        seed
      );

    case "gk":
      return generateGKQuestion(
        classLevel,
        language,
        seed
      );

    case "english":
      return generateEnglishQuestion(
        classLevel,
        language,
        seed
      );

    case "evs":
      return generateEVSQuestion(
        classLevel,
        language,
        seed
      );

    default:
      throw new Error(
        `Unsupported dynamic subject: ${subject}`
      );
  }
}

/*
 * ============================================================
 * CANDIDATE GENERATION
 * ============================================================
 */

export function generateDynamicQuestionCandidates(
  classLevel: ClassLevel,
  language: Language,
  count = 100,
  subject?: Subject
): QuizQuestion[] {
  const questions: QuizQuestion[] =
    [];

  const subjects =
    subject &&
    normalizeSubject(subject) !==
      "random"
      ? [subject]
      : [
          "mathematics",
          "science",
          "gk",
          "english",
          "evs",
        ];

  let seed =
    Math.floor(
      Math.random() * 7_900_000
    ) + 1;

  let safety = 0;

  while (
    questions.length < count &&
    safety < count * 20
  ) {
    safety++;

    const selectedSubject =
      subjects[
        questions.length %
          subjects.length
      ];

    questions.push(
      generateDynamicQuestion(
        classLevel,
        language,
        selectedSubject,
        seed
      )
    );

    seed++;

    if (
      seed > 7_900_000
    ) {
      seed = 1;
    }
  }

  return questions;
}

export function getDynamicSubjects(): Subject[] {
  return [...DYNAMIC_SUBJECTS];
}