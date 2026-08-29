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
    status: "Coming Soon",
  },
  {
    id: 4,
    name: "JSON Formatter",
    icon: "{ }",
    category: "Developer",
    description:
      "Format and organize JSON data so it is easier to read and debug.",
    status: "Coming Soon",
  },
  {
    id: 5,
    name: "CSV Viewer",
    icon: "📊",
    category: "Data",
    description:
      "View and inspect CSV datasets in a clean, readable interface.",
    status: "Coming Soon",
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
    name: "AI Prompt Helper",
    icon: "🤖",
    category: "AI",
    description:
      "Create clearer and more effective prompts for different AI tasks.",
    status: "Coming Soon",
  },
  {
    id: 10,
    name: "Word Counter",
    icon: "🔢",
    category: "Text",
    description:
      "Count words, characters, sentences and paragraphs in your text.",
    status: "Coming Soon",
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

    </main>
  );
}