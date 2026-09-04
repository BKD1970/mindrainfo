"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";

const categories = [
  "All Tools",
  "PDF",
  "Images",
  "Text",
  "Developer",
  "Data",
  "Calculators",
  "AI",
  "Media",
];

const tools = [
  {
    id: 1,
    name: "PDF Tools",
    icon: "📄",
    category: "PDF",
    description:
      "Merge, split, compress, rotate, organize and convert PDF files quickly.",
    status: "Available",
    target: "/tools/pdf",
  },
  {
    id: 2,
    name: "Image Compressor",
    icon: "🖼️",
    category: "Images",
    description:
      "Reduce image file size while maintaining good visual quality.",
    target: "/tools/image-compressor",
    status: "Available",
  },
  {
    id: 3,
    name: "Text Formatter",
    icon: "✍️",
    category: "Text",
    description:
      "Clean, format and transform text quickly for everyday work.",
    status: "Available",
  target: "/tools/text-formatter",
  },
  {
    id: 4,
    name: "JSON Formatter",
    icon: "{ }",
    category: "Developer",
    description:
      "Format and organize JSON data so it is easier to read and debug.",
    status: "Available",
    target: "/tools/json-formatter",
  },
  {
    id: 5,
    name: "CSV Viewer",
    icon: "📊",
    category: "Data",
    description:
      "View and inspect CSV datasets in a clean, readable interface.",
    status: "Available",
    target: "/tools/csv-viewer",
  },
  {
    id: 6,
    name: "EMI Calculator",
    icon: "₹",
    category: "Calculators",
    description:
      "Calculate monthly EMI, total interest and total loan repayment instantly.",
    status: "Available",
    target: "emi-calculator",
  },
  {
    id: 7,
    name: "Percentage Calculator",
    icon: "%",
    category: "Calculators",
    description:
      "Calculate percentages, percentage increases, decreases and values.",
    status: "Available",
    target: "percentage-calculator",
  },
  {
    id: 8,
    name: "Unit Converter",
    icon: "📐",
    category: "Calculators",
    description:
      "Convert length, weight, temperature and other common measurements.",
    status: "Available",
    target: "unit-converter",
  },
  {
    id: 9,
    name: "Age Calculator",
    icon: "🎂",
    category: "Calculators",
    description:
      "Calculate your exact age in years, months and days from two dates.",
    status: "Available",
    target: "age-calculator",
  },
  {
    id: 10,
    name: "AI Prompt Helper",
    icon: "🤖",
    category: "AI",
    description:
      "Create clearer and more effective prompts for different AI tasks.",
  status: "Available",
  target: "/tools/ai-prompt-helper",
  },
  {
    id: 11,
    name: "Word Counter",
    icon: "🔢",
    category: "Text",
    description:
      "Count words, characters, sentences and paragraphs in your text.",
  status: "Available",
  target: "/tools/word-counter",
  },
  {
    id: 12,
    name: "MindraSave",
    icon: "⬇️",
    category: "Media",
    description:
      "Save supported online videos and audio from a link in convenient media formats.",
    status: "Available",
    target: "/tools/mindrasave",
  },
  {
    id: 13,
    name: "Translator",
    icon: "🌐",
    category: "Text",
    description:
      "Translate between English and Indian languages including Odia, Hindi and many more.",
    status: "Available",
    target: "translator",
  },
];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Tools");

  /* =========================================================
     EMI STATES
  ========================================================= */

  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(5);

  /* =========================================================
     PERCENTAGE STATES
  ========================================================= */

  const [percentage, setPercentage] = useState(20);
  const [percentageOf, setPercentageOf] = useState(500);

  const [originalValue, setOriginalValue] = useState(500);
  const [newValue, setNewValue] = useState(600);

  /* =========================================================
     UNIT CONVERTER STATES
  ========================================================= */

  const [unitCategory, setUnitCategory] = useState("Length");

  const [fromUnit, setFromUnit] = useState("Meter");
  const [toUnit, setToUnit] = useState("Kilometer");

  const [unitValue, setUnitValue] = useState(1);

  /* =========================================================
     AGE CALCULATOR STATES
  ========================================================= */

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  /* =========================================================
     TRANSLATOR STATES
  ========================================================= */

  const languages = [
    { name: "English", code: "en-IN" },
    { name: "Assamese", code: "as-IN" },
    { name: "Bengali", code: "bn-IN" },
    { name: "Bodo", code: "brx-IN" },
    { name: "Dogri", code: "doi-IN" },
    { name: "Gujarati", code: "gu-IN" },
    { name: "Hindi", code: "hi-IN" },
    { name: "Kannada", code: "kn-IN" },
    { name: "Kashmiri", code: "ks-IN" },
    { name: "Konkani", code: "kok-IN" },
    { name: "Maithili", code: "mai-IN" },
    { name: "Malayalam", code: "ml-IN" },
    { name: "Manipuri", code: "mni-IN" },
    { name: "Marathi", code: "mr-IN" },
    { name: "Nepali", code: "ne-IN" },
    { name: "Odia", code: "od-IN" },
    { name: "Punjabi", code: "pa-IN" },
    { name: "Sanskrit", code: "sa-IN" },
    { name: "Santali", code: "sat-IN" },
    { name: "Sindhi", code: "sd-IN" },
    { name: "Tamil", code: "ta-IN" },
    { name: "Telugu", code: "te-IN" },
    { name: "Urdu", code: "ur-IN" },
  ];

  const [sourceLanguage, setSourceLanguage] = useState("od-IN");
  const [targetLanguage, setTargetLanguage] = useState("hi-IN");

  const [translationInput, setTranslationInput] = useState("");
  const [translationResult, setTranslationResult] = useState("");

  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState("");

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);

    setTranslationInput(translationResult);
    setTranslationResult(translationInput);

    setTranslationError("");
  };

  const handleTranslate = async () => {
    const text = translationInput.trim();

    if (!text) {
      setTranslationError("Please enter some text to translate.");
      setTranslationResult("");
      return;
    }

    if (text.length > 2000) {
      setTranslationError(
        "Please keep the text within 2000 characters."
      );
      setTranslationResult("");
      return;
    }

    if (sourceLanguage === targetLanguage) {
      setTranslationResult(text);
      setTranslationError("");
      return;
    }

    setIsTranslating(true);
    setTranslationError("");
    setTranslationResult("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: text,
          sourceLanguageCode: sourceLanguage,
          targetLanguageCode: targetLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Translation failed. Please try again."
        );
      }

      setTranslationResult(data.translatedText || "");
    } catch (error) {
      setTranslationError(
        error instanceof Error
          ? error.message
          : "Translation failed. Please try again."
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const copyTranslation = async () => {
    if (!translationResult) return;

    try {
      await navigator.clipboard.writeText(translationResult);
    } catch {
      // Ignore clipboard errors.
    }
  };
  /* =========================================================
     FILTERED TOOLS
  ========================================================= */

  const filteredTools =
    selectedCategory === "All Tools"
      ? tools
      : tools.filter((tool) => tool.category === selectedCategory);

  /* =========================================================
     EMI CALCULATION
  ========================================================= */

  const calculations = useMemo(() => {
    const principal = loanAmount;

    const monthlyInterestRate = interestRate / 12 / 100;

    const numberOfMonths = loanTenure * 12;

    let emi = 0;

    if (monthlyInterestRate === 0) {
      emi = principal / numberOfMonths;
    } else {
      emi =
        (principal *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfMonths)) /
        (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);
    }

    const totalPayment = emi * numberOfMonths;

    const totalInterest = totalPayment - principal;

    return {
      emi,
      totalPayment,
      totalInterest,
    };
  }, [loanAmount, interestRate, loanTenure]);

  /* =========================================================
     PERCENTAGE CALCULATIONS
  ========================================================= */

  const percentageResult = (percentage / 100) * percentageOf;

  const percentageChange =
    originalValue !== 0
      ? ((newValue - originalValue) / originalValue) * 100
      : 0;

  /* =========================================================
     UNIT CONVERSION
  ========================================================= */

  const unitConversions: Record<string, Record<string, number>> = {
    Length: {
      Meter: 1,
      Kilometer: 1000,
      Centimeter: 0.01,
      Millimeter: 0.001,
      Mile: 1609.344,
      Yard: 0.9144,
      Foot: 0.3048,
      Inch: 0.0254,
    },

    Weight: {
      Kilogram: 1,
      Gram: 0.001,
      Milligram: 0.000001,
      Pound: 0.45359237,
      Ounce: 0.0283495,
      Tonne: 1000,
    },
  };

  const convertUnit = () => {
    if (unitCategory === "Temperature") {
      if (fromUnit === toUnit) return unitValue;

      if (fromUnit === "Celsius" && toUnit === "Fahrenheit") {
        return (unitValue * 9) / 5 + 32;
      }

      if (fromUnit === "Fahrenheit" && toUnit === "Celsius") {
        return ((unitValue - 32) * 5) / 9;
      }

      if (fromUnit === "Celsius" && toUnit === "Kelvin") {
        return unitValue + 273.15;
      }

      if (fromUnit === "Kelvin" && toUnit === "Celsius") {
        return unitValue - 273.15;
      }

      if (fromUnit === "Fahrenheit" && toUnit === "Kelvin") {
        return ((unitValue - 32) * 5) / 9 + 273.15;
      }

      if (fromUnit === "Kelvin" && toUnit === "Fahrenheit") {
        return ((unitValue - 273.15) * 9) / 5 + 32;
      }
    }

    const category = unitConversions[unitCategory];

    if (!category) return unitValue;

    const valueInBase = unitValue * category[fromUnit];

    return valueInBase / category[toUnit];
  };

  const convertedValue = convertUnit();

  const getUnits = () => {
    if (unitCategory === "Length") {
      return [
        "Meter",
        "Kilometer",
        "Centimeter",
        "Millimeter",
        "Mile",
        "Yard",
        "Foot",
        "Inch",
      ];
    }

    if (unitCategory === "Weight") {
      return [
        "Kilogram",
        "Gram",
        "Milligram",
        "Pound",
        "Ounce",
        "Tonne",
      ];
    }

    return ["Celsius", "Fahrenheit", "Kelvin"];
  };

  const handleUnitCategoryChange = (category: string) => {
    setUnitCategory(category);

    if (category === "Length") {
      setFromUnit("Meter");
      setToUnit("Kilometer");
    }

    if (category === "Weight") {
      setFromUnit("Kilogram");
      setToUnit("Gram");
    }

    if (category === "Temperature") {
      setFromUnit("Celsius");
      setToUnit("Fahrenheit");
    }
  };

  /* =========================================================
     AGE CALCULATION
  ========================================================= */

  const ageCalculation = useMemo(() => {
    if (!fromDate || !toDate) {
      return {
        valid: false,
        message: "Select both dates to calculate age.",
        years: 0,
        months: 0,
        days: 0,
        totalDays: 0,
      };
    }

    const [fromYear, fromMonth, fromDay] = fromDate
      .split("-")
      .map(Number);

    const [toYear, toMonth, toDay] = toDate
      .split("-")
      .map(Number);

    const fromUTC = Date.UTC(fromYear, fromMonth - 1, fromDay);
    const toUTC = Date.UTC(toYear, toMonth - 1, toDay);

    if (toUTC < fromUTC) {
      return {
        valid: false,
        message: "To Date cannot be earlier than From Date.",
        years: 0,
        months: 0,
        days: 0,
        totalDays: 0,
      };
    }

    let years = toYear - fromYear;
    let months = toMonth - fromMonth;
    let days = toDay - fromDay;

    if (days < 0) {
      months--;

      const daysInPreviousMonth = new Date(
        Date.UTC(toYear, toMonth - 1, 0)
      ).getUTCDate();

      days += daysInPreviousMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor(
      (toUTC - fromUTC) / (1000 * 60 * 60 * 24)
    );

    return {
      valid: true,
      message: "",
      years,
      months,
      days,
      totalDays,
    };
  }, [fromDate, toDate]);

  /* =========================================================
     CURRENCY FORMAT
  ========================================================= */

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const interestPercentage =
    calculations.totalPayment > 0
      ? (calculations.totalInterest / calculations.totalPayment) * 100
      : 0;

  const principalPercentage = 100 - interestPercentage;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}
      <SiteHeader />

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-orange-300/25 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-48 h-[420px] w-[420px] rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm backdrop-blur-md">

              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />

              Free Online Tools

            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">

              Useful tools.
              <br />

              <span className="text-orange-500">
                Simple to use.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              Free and practical tools designed to help you work faster,
              organize information and solve everyday digital tasks.
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          CATEGORY FILTER
      ======================================================= */}

      <section className="mx-auto max-w-7xl px-6">

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex gap-3 overflow-x-auto pb-1">

            {categories.map((category) => (

              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-gray-900 text-white shadow-md"
                    : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>

            ))}

          </div>

        </div>

      </section>

      {/* ======================================================
          TOOLS
      ======================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mb-12">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Tool Library
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Choose a tool.
          </h2>

          <p className="mt-4 max-w-2xl text-gray-600">
            Browse our collection of practical digital tools. More tools will
            be added as MindraInfo grows.
          </p>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {filteredTools.map((tool) => (

            <article
              key={tool.id}
              className="group relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl"
            >

              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-200/25 blur-2xl transition group-hover:bg-orange-300/40" />

              <div className="relative z-10">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl font-bold text-orange-500 transition duration-300 group-hover:scale-110">
                  {tool.icon}
                </div>

                <div className="mt-7 flex items-start justify-between gap-4">

                  <h3 className="text-2xl font-black">
                    {tool.name}
                  </h3>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      tool.status === "Available"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tool.status}
                  </span>

                </div>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {tool.description}
                </p>

                {tool.target ? (
                  tool.target.startsWith("/") ? (
                    <Link
                      href={tool.target}
                      className="mt-7 flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-600"
                    >
                      Open Tool →
                    </Link>
                  ) : (
                    <a
                      href={`#${tool.target}`}
                      className="mt-7 flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-600"
                    >
                      Open Tool →
                    </a>
                  )
                ) : (
                  <button
                    disabled
                    className="mt-7 w-full cursor-not-allowed rounded-xl bg-gray-100 px-5 py-3.5 text-sm font-bold text-gray-400"
                  >
                    Coming Soon
                  </button>
                )}

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* ======================================================
          EMI CALCULATOR
      ======================================================= */}

      <section
        id="emi-calculator"
        className="scroll-mt-10 border-y border-gray-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
              Financial Calculator
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              EMI Calculator
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Calculate your estimated monthly loan EMI, total interest and
              total repayment amount.
            </p>

          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">

            {/* INPUTS */}

            <div className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm md:p-9">

              <h3 className="text-2xl font-black">
                Loan Details
              </h3>

              {/* LOAN AMOUNT */}

              <div className="mt-8">

                <div className="flex items-center justify-between">

                  <label className="font-semibold">
                    Loan Amount
                  </label>

                  <span className="font-bold text-orange-500">
                    {formatCurrency(loanAmount)}
                  </span>

                </div>

                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) =>
                    setLoanAmount(Number(e.target.value))
                  }
                  className="mt-5 w-full accent-orange-500"
                />

                <input
                  type="number"
                  min="10000"
                  max="10000000"
                  value={loanAmount}
                  onChange={(e) =>
                    setLoanAmount(Number(e.target.value))
                  }
                  className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none focus:border-orange-500"
                />

              </div>

              {/* INTEREST */}

              <div className="mt-8">

                <div className="flex items-center justify-between">

                  <label className="font-semibold">
                    Interest Rate
                  </label>

                  <span className="font-bold text-orange-500">
                    {interestRate.toFixed(2)}%
                  </span>

                </div>

                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(Number(e.target.value))
                  }
                  className="mt-5 w-full accent-orange-500"
                />

                <input
                  type="number"
                  min="1"
                  max="25"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(Number(e.target.value))
                  }
                  className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none focus:border-orange-500"
                />

              </div>

              {/* TENURE */}

              <div className="mt-8">

                <div className="flex items-center justify-between">

                  <label className="font-semibold">
                    Loan Tenure
                  </label>

                  <span className="font-bold text-orange-500">
                    {loanTenure} Years
                  </span>

                </div>

                <input
                  type="range"
                  min="1"
                  max="30"
                  value={loanTenure}
                  onChange={(e) =>
                    setLoanTenure(Number(e.target.value))
                  }
                  className="mt-5 w-full accent-orange-500"
                />

                <input
                  type="number"
                  min="1"
                  max="30"
                  value={loanTenure}
                  onChange={(e) =>
                    setLoanTenure(Number(e.target.value))
                  }
                  className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none focus:border-orange-500"
                />

              </div>

            </div>

            {/* RESULTS */}

            <div className="rounded-[2rem] bg-gray-900 p-7 text-white shadow-xl md:p-9">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
                Monthly EMI
              </p>

              <div className="mt-3 text-5xl font-black">
                {formatCurrency(calculations.emi)}
              </div>

              <div className="mt-10 space-y-5">

                <div className="flex justify-between border-b border-white/10 pb-5">

                  <span className="text-gray-400">
                    Principal
                  </span>

                  <span className="font-bold">
                    {formatCurrency(loanAmount)}
                  </span>

                </div>

                <div className="flex justify-between border-b border-white/10 pb-5">

                  <span className="text-gray-400">
                    Total Interest
                  </span>

                  <span className="font-bold text-orange-400">
                    {formatCurrency(calculations.totalInterest)}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-400">
                    Total Payment
                  </span>

                  <span className="font-bold">
                    {formatCurrency(calculations.totalPayment)}
                  </span>

                </div>

              </div>

              <div className="mt-10">

                <div className="flex h-4 overflow-hidden rounded-full bg-white/10">

                  <div
                    className="bg-orange-500"
                    style={{
                      width: `${principalPercentage}%`,
                    }}
                  />

                  <div
                    className="bg-orange-300"
                    style={{
                      width: `${interestPercentage}%`,
                    }}
                  />

                </div>

                <div className="mt-3 flex justify-between text-xs">

                  <span className="text-orange-500">
                    Principal
                  </span>

                  <span className="text-orange-300">
                    Interest
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          PERCENTAGE CALCULATOR
      ======================================================= */}

      <section
        id="percentage-calculator"
        className="scroll-mt-10 bg-[#f7f7f4]"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
              Math Tool
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              Percentage Calculator
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              Quickly calculate percentages and percentage changes.
            </p>

          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">

            {/* BASIC PERCENTAGE */}

            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">

              <h3 className="text-2xl font-black">
                What is X% of Y?
              </h3>

              <div className="mt-8 grid gap-5">

                <div>

                  <label className="text-sm font-semibold">
                    Percentage
                  </label>

                  <input
                    type="number"
                    value={percentage}
                    onChange={(e) =>
                      setPercentage(Number(e.target.value))
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none focus:border-orange-500"
                  />

                </div>

                <div>

                  <label className="text-sm font-semibold">
                    Number
                  </label>

                  <input
                    type="number"
                    value={percentageOf}
                    onChange={(e) =>
                      setPercentageOf(Number(e.target.value))
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none focus:border-orange-500"
                  />

                </div>

              </div>

              <div className="mt-8 rounded-2xl bg-orange-50 p-6">

                <p className="text-sm text-gray-600">
                  Result
                </p>

                <p className="mt-2 text-4xl font-black text-orange-500">
                  {percentageResult.toLocaleString("en-IN")}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {percentage}% of {percentageOf}
                </p>

              </div>

            </div>

            {/* PERCENTAGE CHANGE */}

            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">

              <h3 className="text-2xl font-black">
                Percentage Change
              </h3>

              <div className="mt-8 grid gap-5">

                <div>

                  <label className="text-sm font-semibold">
                    Original Value
                  </label>

                  <input
                    type="number"
                    value={originalValue}
                    onChange={(e) =>
                      setOriginalValue(Number(e.target.value))
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none focus:border-orange-500"
                  />

                </div>

                <div>

                  <label className="text-sm font-semibold">
                    New Value
                  </label>

                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) =>
                      setNewValue(Number(e.target.value))
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none focus:border-orange-500"
                  />

                </div>

              </div>

              <div className="mt-8 rounded-2xl bg-gray-900 p-6 text-white">

                <p className="text-sm text-gray-400">
                  Percentage Change
                </p>

                <p className="mt-2 text-4xl font-black text-orange-400">
                  {percentageChange.toFixed(2)}%
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  {percentageChange >= 0
                    ? "Increase"
                    : "Decrease"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          UNIT CONVERTER
      ======================================================= */}

      <section
        id="unit-converter"
        className="scroll-mt-10 border-y border-gray-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
              Conversion Tool
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              Unit Converter
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              Convert length, weight and temperature instantly.
            </p>

          </div>

          <div className="mx-auto mt-14 max-w-4xl rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm md:p-10">

            {/* CATEGORY */}

            <div>

              <label className="text-sm font-semibold">
                Conversion Type
              </label>

              <div className="mt-3 flex flex-wrap gap-3">

                {["Length", "Weight", "Temperature"].map(
                  (category) => (

                    <button
                      key={category}
                      onClick={() =>
                        handleUnitCategoryChange(category)
                      }
                      className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
                        unitCategory === category
                          ? "bg-orange-500 text-white"
                          : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>

                  )
                )}

              </div>

            </div>

            {/* VALUE */}

            <div className="mt-8">

              <label className="text-sm font-semibold">
                Value
              </label>

              <input
                type="number"
                value={unitValue}
                onChange={(e) =>
                  setUnitValue(Number(e.target.value))
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-lg font-bold outline-none focus:border-orange-500"
              />

            </div>

            {/* FROM / TO */}

            <div className="mt-8 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-end">

              <div>

                <label className="text-sm font-semibold">
                  From
                </label>

                <select
                  value={fromUnit}
                  onChange={(e) =>
                    setFromUnit(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 font-semibold outline-none focus:border-orange-500"
                >

                  {getUnits().map((unit) => (

                    <option
                      key={unit}
                      value={unit}
                    >
                      {unit}
                    </option>

                  ))}

                </select>

              </div>

              <div className="hidden pb-3 text-2xl font-bold text-orange-500 md:block">
                →
              </div>

              <div>

                <label className="text-sm font-semibold">
                  To
                </label>

                <select
                  value={toUnit}
                  onChange={(e) =>
                    setToUnit(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 font-semibold outline-none focus:border-orange-500"
                >

                  {getUnits().map((unit) => (

                    <option
                      key={unit}
                      value={unit}
                    >
                      {unit}
                    </option>

                  ))}

                </select>

              </div>

            </div>

            {/* RESULT */}

            <div className="mt-10 rounded-3xl bg-gray-900 p-8 text-center text-white">

              <p className="text-sm text-gray-400">
                Conversion Result
              </p>

              <p className="mt-3 break-words text-4xl font-black md:text-5xl">

                {Number.isFinite(convertedValue)
                  ? convertedValue.toLocaleString("en-IN", {
                      maximumFractionDigits: 8,
                    })
                  : "Invalid"}

              </p>

              <p className="mt-3 text-gray-400">

                {unitValue} {fromUnit} ={" "}
                {Number.isFinite(convertedValue)
                  ? convertedValue.toLocaleString("en-IN", {
                      maximumFractionDigits: 8,
                    })
                  : "Invalid"}{" "}
                {toUnit}

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          AGE CALCULATOR
      ======================================================= */}

      <section
        id="age-calculator"
        className="scroll-mt-10 border-y border-gray-200 bg-[#f7f7f4]"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          {/* HEADER */}

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
              Date & Time Tool
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              Age Calculator
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Calculate your exact age between two dates in years, months
              and days.
            </p>

          </div>

          {/* CALCULATOR */}

          <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white shadow-xl">

            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">

              {/* LEFT SIDE */}

              <div className="p-7 md:p-10">

                <div className="flex items-center gap-3">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                    🎂
                  </div>

                  <div>

                    <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
                      Find your age
                    </p>

                    <h3 className="text-2xl font-black">
                      Enter two dates
                    </h3>

                  </div>

                </div>

                {/* FROM DATE */}

                <div className="mt-10">

                  <label
                    htmlFor="age-from-date"
                    className="text-sm font-bold text-gray-700"
                  >
                    From Date
                  </label>

                  <input
                    id="age-from-date"
                    type="date"
                    value={fromDate}
                    onChange={(e) =>
                      setFromDate(e.target.value)
                    }
                    className="mt-3 w-full cursor-pointer rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-base font-semibold text-gray-800 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Usually your date of birth.
                  </p>

                </div>

                {/* TO DATE */}

                <div className="mt-7">

                  <label
                    htmlFor="age-to-date"
                    className="text-sm font-bold text-gray-700"
                  >
                    To Date
                  </label>

                  <input
                    id="age-to-date"
                    type="date"
                    value={toDate}
                    onChange={(e) =>
                      setToDate(e.target.value)
                    }
                    className="mt-3 w-full cursor-pointer rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-base font-semibold text-gray-800 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    The date on which you want to calculate the age.
                  </p>

                </div>

                {/* QUICK ACTION */}

                <button
                  type="button"
                  onClick={() =>
                    setToDate(new Date().toISOString().split("T")[0])
                  }
                  className="mt-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
                >
                  Use Today
                </button>

              </div>

              {/* RIGHT SIDE */}

              <div className="relative overflow-hidden bg-gray-900 p-7 text-white md:p-10">

                {/* DECORATIVE GLOW */}

                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

                {/* GROWING STICKER */}

                <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">

                  <div className="absolute inset-x-0 bottom-5 h-px bg-white/10" />

                  <div className="age-growth-stage age-child">
                    🧒
                  </div>

                  <div className="age-growth-stage age-teen">
                    🧑
                  </div>

                  <div className="age-growth-stage age-young">
                    🧑‍💼
                  </div>

                  <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                    Growing through life
                  </div>

                </div>

                {/* RESULT */}

                <div className="relative mt-8">

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
                    Exact Age
                  </p>

                  {ageCalculation.valid ? (

                    <>
                      <div className="mt-4 grid grid-cols-3 gap-3">

                        <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">

                          <div className="text-4xl font-black">
                            {ageCalculation.years}
                          </div>

                          <div className="mt-1 text-xs font-semibold text-gray-400">
                            Years
                          </div>

                        </div>

                        <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">

                          <div className="text-4xl font-black">
                            {ageCalculation.months}
                          </div>

                          <div className="mt-1 text-xs font-semibold text-gray-400">
                            Months
                          </div>

                        </div>

                        <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">

                          <div className="text-4xl font-black">
                            {ageCalculation.days}
                          </div>

                          <div className="mt-1 text-xs font-semibold text-gray-400">
                            Days
                          </div>

                        </div>

                      </div>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">

                        <div className="flex items-center justify-between gap-4">

                          <span className="text-sm text-gray-400">
                            Total days
                          </span>

                          <span className="font-black text-orange-400">
                            {ageCalculation.totalDays.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>

                      </div>
                    </>

                  ) : (

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6">

                      <div className="text-4xl">
                        📅
                      </div>

                      <p className="mt-4 text-sm leading-6 text-gray-400">
                        {ageCalculation.message}
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

          {/* INFO */}

          <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-orange-100 bg-orange-50/60 p-5">

            <div className="flex gap-3">

              <div className="text-xl">
                💡
              </div>

              <p className="text-sm leading-6 text-gray-600">
                Enter your date of birth in <strong>From Date</strong> and
                another date in <strong>To Date</strong>. The calculator
                gives the difference in complete years, months and days.
              </p>

            </div>

          </div>

        </div>

      </section>
            {/* ======================================================
          TRANSLATOR
      ======================================================= */}

      <section
        id="translator"
        className="scroll-mt-10 border-y border-gray-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          {/* HEADER */}

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
              Language Tool
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              Translator
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Translate naturally between English and Indian languages,
              including Odia, Hindi, Bengali, Tamil, Telugu and many more.
            </p>

          </div>

          {/* TRANSLATOR CARD */}

          <div className="mx-auto mt-14 max-w-6xl rounded-[2.5rem] border border-gray-200 bg-white p-6 shadow-xl md:p-10">

            {/* LANGUAGE BAR */}

            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">

              {/* SOURCE */}

              <div>

                <label className="text-sm font-bold text-gray-700">
                  Translate From
                </label>

                <select
                  value={sourceLanguage}
                  onChange={(e) => {
                    setSourceLanguage(e.target.value);
                    setTranslationError("");
                  }}
                  className="mt-3 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-semibold text-gray-800 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                >

                  {languages.map((language) => (

                    <option
                      key={language.code}
                      value={language.code}
                    >
                      {language.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* SWAP */}

              <button
                type="button"
                onClick={swapLanguages}
                className="flex h-12 w-12 items-center justify-center self-end rounded-full border border-gray-200 bg-white text-xl font-bold text-orange-500 shadow-sm transition hover:-rotate-180 hover:border-orange-300 hover:bg-orange-50"
                title="Swap languages"
              >
                ⇄
              </button>

              {/* TARGET */}

              <div>

                <label className="text-sm font-bold text-gray-700">
                  Translate To
                </label>

                <select
                  value={targetLanguage}
                  onChange={(e) => {
                    setTargetLanguage(e.target.value);
                    setTranslationError("");
                  }}
                  className="mt-3 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-semibold text-gray-800 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                >

                  {languages.map((language) => (

                    <option
                      key={language.code}
                      value={language.code}
                    >
                      {language.name}
                    </option>

                  ))}

                </select>

              </div>

            </div>

            {/* TEXT AREAS */}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

              {/* INPUT */}

              <div className="relative">

                <div className="mb-3 flex items-center justify-between">

                  <label className="text-sm font-bold text-gray-700">
                    Your Text
                  </label>

                  <span
                    className={`text-xs font-semibold ${
                      translationInput.length > 2000
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {translationInput.length}/2000
                  </span>

                </div>

                <textarea
                  value={translationInput}
                  onChange={(e) => {
                    setTranslationInput(e.target.value);
                    setTranslationError("");
                  }}
                  maxLength={2000}
                  placeholder="Type or paste your text here..."
                  className="min-h-[280px] w-full resize-none rounded-3xl border border-gray-200 bg-gray-50 p-6 text-base leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />

              </div>

              {/* RESULT */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <label className="text-sm font-bold text-gray-700">
                    Translation
                  </label>

                  {translationResult && (

                    <button
                      type="button"
                      onClick={copyTranslation}
                      className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 transition hover:bg-orange-100"
                    >
                      Copy
                    </button>

                  )}

                </div>

                <div className="min-h-[280px] rounded-3xl border border-gray-200 bg-gray-900 p-6 text-white">

                  {isTranslating ? (

                    <div className="flex min-h-[230px] flex-col items-center justify-center text-center">

                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-orange-400" />

                      <p className="mt-5 text-sm font-semibold text-gray-400">
                        Translating...
                      </p>

                    </div>

                  ) : translationError ? (

                    <div className="flex min-h-[230px] flex-col items-center justify-center text-center">

                      <div className="text-4xl">
                        ⚠️
                      </div>

                      <p className="mt-4 max-w-md text-sm leading-6 text-red-300">
                        {translationError}
                      </p>

                    </div>

                  ) : translationResult ? (

                    <p className="whitespace-pre-wrap text-base leading-8 text-gray-100">
                      {translationResult}
                    </p>

                  ) : (

                    <div className="flex min-h-[230px] flex-col items-center justify-center text-center">

                      <div className="text-5xl">
                        🌐
                      </div>

                      <p className="mt-5 text-sm font-semibold text-gray-400">
                        Your translated text will appear here.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

            {/* TRANSLATE BUTTON */}

            <div className="mt-7 flex flex-col items-center gap-4">

              <button
                type="button"
                onClick={handleTranslate}
                disabled={isTranslating}
                className="w-full rounded-2xl bg-orange-500 px-8 py-4 text-base font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:min-w-[240px]"
              >
                {isTranslating
                  ? "Translating..."
                  : "Translate →"}
              </button>

              <p className="text-center text-xs text-gray-400">
                Supports English and 22 Indian languages.
              </p>

            </div>

          </div>

        </div>

      </section>
      
      {/* ======================================================
          FOOTER
      ======================================================= */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

          <Link
            href="/"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Back to MindraInfo →
          </Link>

        </div>

      </footer>

      {/* ======================================================
          AGE GROWTH ANIMATION
      ======================================================= */}

      <style jsx global>{`

        .age-growth-stage {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center bottom;
          filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.25));
          animation-duration: 6s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        .age-child {
          font-size: 4.5rem;
          animation-name: ageChildGrowth;
        }

        .age-teen {
          font-size: 5.5rem;
          animation-name: ageTeenGrowth;
        }

        .age-young {
          font-size: 6.5rem;
          animation-name: ageYoungGrowth;
        }

        @keyframes ageChildGrowth {

          0% {
            opacity: 1;
            transform: translateY(10px) scale(0.85);
          }

          25% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          33% {
            opacity: 0;
            transform: translateY(-4px) scale(1.08);
          }

          100% {
            opacity: 0;
            transform: translateY(-4px) scale(1.08);
          }

        }

        @keyframes ageTeenGrowth {

          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.75);
          }

          25% {
            opacity: 0;
            transform: translateY(5px) scale(0.8);
          }

          33% {
            opacity: 1;
            transform: translateY(0) scale(0.95);
          }

          55% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          66% {
            opacity: 0;
            transform: translateY(-5px) scale(1.08);
          }

          100% {
            opacity: 0;
            transform: translateY(-5px) scale(1.08);
          }

        }

        @keyframes ageYoungGrowth {

          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.7);
          }

          55% {
            opacity: 0;
            transform: translateY(5px) scale(0.8);
          }

          66% {
            opacity: 1;
            transform: translateY(0) scale(0.95);
          }

          85% {
            opacity: 1;
            transform: translateY(-2px) scale(1);
          }

          100% {
            opacity: 0;
            transform: translateY(-8px) scale(1.08);
          }

        }

        @media (prefers-reduced-motion: reduce) {

          .age-growth-stage {
            animation: none;
          }

          .age-child {
            opacity: 1;
            transform: scale(1);
          }

          .age-teen,
          .age-young {
            opacity: 0;
          }

        }

      `}</style>

    </main>
  );
}