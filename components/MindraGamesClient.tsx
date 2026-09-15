"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

type Language = {
  code: string;
  name: string;
  native: string;
};

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const QUESTIONS_PER_EPISODE = 5;

const LANGUAGES: Language[] = [
  { code: "en", name: "English", native: "English" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "brx", name: "Bodo", native: "बड़ो" },
  { code: "doi", name: "Dogri", native: "डोगरी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ks", name: "Kashmiri", native: "कॉशुर" },
  { code: "kok", name: "Konkani", native: "कोंकणी" },
  { code: "mai", name: "Maithili", native: "मैथिली" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "mni", name: "Manipuri", native: "মেইতেই" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्" },
  { code: "sat", name: "Santali", native: "ᱥᱱᱛᱟᱲᱤ" },
  { code: "sd", name: "Sindhi", native: "سنڌي" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ur", name: "Urdu", native: "اُردُو" },
];

const I18N: Record<string, Record<string, string>> = {
  en: {
    badge: "🎮 MindaGames",
    title: "Dharma",
    title2: "Quiz",
    subtitle:
      "A mythology-inspired knowledge game with cinematic judgment scenes.",
    begin: "Begin Judgment →",
    language: "Language",
    question: "Question",
    continue: "Continue →",
    episode: "Episode",
    episodeComplete: "Episode Complete",
    score: "Your Score",
    nextEpisode: "Go to Next Episode →",
    playAgain: "Play Again",
    back: "← Back to MindaGames",
    perfect: "Perfect knowledge run.",
    excellent: "Excellent knowledge.",
    good: "Good attempt. Keep learning.",
    learning: "A new journey of learning awaits.",
    creator: "Brahma opens the path to Svarga",
    creatorText:
      "A correct answer unlocks the game's celestial path.",
    death: "Yama has judged the answer",
    deathText:
      "The incorrect answer sends your game character toward the Naraka sequence.",
    finalNote:
      "This is a mythology-inspired entertainment game. It does not determine anyone's actual religious destiny.",
    justGame: "🎬 Just a Game!",
    justGameText:
      "The drama is part of the game. Your answers here do not decide your real-life spiritual fate.",
    questionCount: "Questions answered",
    correct: "Correct",
  },

  hi: {
    badge: "🎮 मिंडागेम्स",
    title: "धर्म",
    title2: "क्विज़",
    subtitle:
      "पौराणिक परंपराओं से प्रेरित ज्ञान-खेल, जिसमें सिनेमाई निर्णय दृश्य हैं।",
    begin: "निर्णय शुरू करें →",
    language: "भाषा",
    question: "प्रश्न",
    continue: "आगे बढ़ें →",
    episode: "एपिसोड",
    episodeComplete: "एपिसोड पूरा हुआ",
    score: "आपका स्कोर",
    nextEpisode: "अगले एपिसोड पर जाएँ →",
    playAgain: "फिर खेलें",
    back: "← मिंडागेम्स पर लौटें",
    perfect: "पूर्ण ज्ञान यात्रा।",
    excellent: "बहुत अच्छा ज्ञान।",
    good: "अच्छा प्रयास। सीखते रहें।",
    learning: "सीखने की एक नई यात्रा आपका इंतज़ार कर रही है।",
    creator: "ब्रह्मा ने स्वर्ग का मार्ग खोला",
    creatorText:
      "सही उत्तर से खेल में स्वर्ग वाला रास्ता खुलता है।",
    death: "यम ने उत्तर का निर्णय किया",
    deathText:
      "गलत उत्तर आपके गेम-पात्र को नरक वाले दृश्य की ओर ले जाता है।",
    finalNote:
      "यह पौराणिक परंपराओं से प्रेरित मनोरंजन गेम है। यह किसी व्यक्ति के वास्तविक धार्मिक भाग्य का निर्णय नहीं करता।",
    justGame: "🎬 यह सिर्फ़ एक गेम है!",
    justGameText:
      "नाटकीय दृश्य खेल का हिस्सा हैं। आपके उत्तर वास्तविक जीवन के आध्यात्मिक भाग्य का निर्णय नहीं करते।",
    questionCount: "उत्तर दिए गए प्रश्न",
    correct: "सही",
  },

  or: {
    badge: "🎮 ମିଣ୍ଡାଗେମ୍ସ",
    title: "ଧର୍ମ",
    title2: "କୁଇଜ୍",
    subtitle:
      "ପୁରାଣ ପରମ୍ପରାରୁ ପ୍ରେରିତ ଜ୍ଞାନ ଖେଳ, ଯେଉଁଥିରେ ସିନେମାଟିକ୍ ନ୍ୟାୟ ଦୃଶ୍ୟ ରହିଛି।",
    begin: "ନିର୍ଣ୍ଣୟ ଆରମ୍ଭ କରନ୍ତୁ →",
    language: "ଭାଷା",
    question: "ପ୍ରଶ୍ନ",
    continue: "ଆଗକୁ →",
    episode: "ଏପିସୋଡ୍",
    episodeComplete: "ଏପିସୋଡ୍ ସମାପ୍ତ",
    score: "ଆପଣଙ୍କ ସ୍କୋର",
    nextEpisode: "ପରବର୍ତ୍ତୀ ଏପିସୋଡ୍ →",
    playAgain: "ପୁଣି ଖେଳନ୍ତୁ",
    back: "← ମିଣ୍ଡାଗେମ୍ସକୁ ଫେରନ୍ତୁ",
    perfect: "ସମ୍ପୂର୍ଣ୍ଣ ଜ୍ଞାନ ଯାତ୍ରା।",
    excellent: "ଅତ୍ୟନ୍ତ ଭଲ।",
    good: "ଭଲ ପ୍ରୟାସ। ଶିଖୁଥାନ୍ତୁ।",
    learning: "ଶିଖିବାର ନୂଆ ଯାତ୍ରା ଅପେକ୍ଷା କରୁଛି।",
    creator: "ବ୍ରହ୍ମା ସ୍ୱର୍ଗର ପଥ ଖୋଲିଲେ",
    creatorText:
      "ସଠିକ୍ ଉତ୍ତର ଖେଳରେ ସ୍ୱର୍ଗ ପଥ ଖୋଲେ।",
    death: "ଯମ ଉତ୍ତରର ନ୍ୟାୟ କଲେ",
    deathText:
      "ଭୁଲ ଉତ୍ତର ଆପଣଙ୍କ ଗେମ୍ ପାତ୍ରକୁ ନରକ ଦୃଶ୍ୟକୁ ନେଇଯାଏ।",
    finalNote:
      "ଏହା ପୁରାଣ ପରମ୍ପରାରୁ ପ୍ରେରିତ ଏକ ମନୋରଞ୍ଜନ ଖେଳ। ଏହା କାହାର ବାସ୍ତବ ଧାର୍ମିକ ଭାଗ୍ୟ ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ।",
    justGame: "🎬 ଏହା କେବଳ ଏକ ଗେମ୍!",
    justGameText:
      "ନାଟକୀୟ ଦୃଶ୍ୟ ଖେଳର ଅଂଶ। ଆପଣଙ୍କ ଉତ୍ତର ବାସ୍ତବ ଆଧ୍ୟାତ୍ମିକ ଭାଗ୍ୟ ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ।",
    questionCount: "ଉତ୍ତର ଦିଆ ପ୍ରଶ୍ନ",
    correct: "ସଠିକ୍",
  },
};

const FACTS: Record<string, Question[]> = {
  en: [
    {
      id: 1,
      question:
        "Who is traditionally associated with death and judgment?",
      options: ["Brahma", "Yama", "Vishnu", "Agni"],
      answer: 1,
      explanation:
        "Yama is traditionally associated with death and judgment.",
    },
    {
      id: 2,
      question:
        "Who is traditionally regarded as the creator in the Trimurti?",
      options: ["Shiva", "Indra", "Brahma", "Surya"],
      answer: 2,
      explanation:
        "Brahma is traditionally regarded as the creator in the Trimurti.",
    },
    {
      id: 3,
      question: "What is Svarga commonly described as?",
      options: [
        "A heavenly realm",
        "A weapon",
        "A river",
        "A mountain",
      ],
      answer: 0,
      explanation:
        "Svarga is commonly described as a heavenly realm in Hindu traditions.",
    },
    {
      id: 4,
      question: "What is Naraka commonly associated with?",
      options: [
        "A heavenly garden",
        "A realm of punishment",
        "A festival",
        "A weapon",
      ],
      answer: 1,
      explanation:
        "Naraka is commonly described as a realm associated with punishment.",
    },
    {
      id: 5,
      question:
        "Who is traditionally associated with preservation in the Trimurti?",
      options: ["Vishnu", "Brahma", "Yama", "Agni"],
      answer: 0,
      explanation:
        "Vishnu is traditionally associated with preservation.",
    },
    {
      id: 6,
      question:
        "Who is traditionally associated with destruction and transformation in the Trimurti?",
      options: ["Brahma", "Shiva", "Indra", "Surya"],
      answer: 1,
      explanation:
        "Shiva is traditionally associated with destruction and transformation.",
    },
    {
      id: 7,
      question:
        "What can dharma broadly refer to in Hindu philosophical contexts?",
      options: [
        "A type of weapon",
        "Duty, conduct or righteous order",
        "A planet",
        "A festival",
      ],
      answer: 1,
      explanation:
        "Dharma has a broad range of meanings including duty, conduct and righteous order.",
    },
    {
      id: 8,
      question:
        "Which deity is commonly depicted with four heads?",
      options: ["Brahma", "Yama", "Vishnu", "Agni"],
      answer: 0,
      explanation:
        "Brahma is commonly depicted with four heads.",
    },
    {
      id: 9,
      question:
        "Which mount is traditionally associated with Yama?",
      options: ["Peacock", "Buffalo", "Swan", "Lion"],
      answer: 1,
      explanation:
        "Yama is traditionally depicted riding a buffalo.",
    },
    {
      id: 10,
      question: "What is the purpose of this quiz?",
      options: [
        "Determine real destiny",
        "Provide a mythology-inspired game",
        "Replace religious teaching",
        "Make legal judgments",
      ],
      answer: 1,
      explanation:
        "It is a mythology-inspired knowledge game, not a real religious judgment.",
    },
  ],

  hi: [
    {
      id: 1,
      question:
        "पारंपरिक रूप से मृत्यु और न्याय से किसे जोड़ा जाता है?",
      options: ["ब्रह्मा", "यम", "विष्णु", "अग्नि"],
      answer: 1,
      explanation:
        "यम को पारंपरिक रूप से मृत्यु और न्याय से जोड़ा जाता है।",
    },
    {
      id: 2,
      question:
        "त्रिमूर्ति में सृष्टिकर्ता के रूप में किसे माना जाता है?",
      options: ["शिव", "इंद्र", "ब्रह्मा", "सूर्य"],
      answer: 2,
      explanation:
        "ब्रह्मा को त्रिमूर्ति में सृष्टिकर्ता माना जाता है।",
    },
    {
      id: 3,
      question:
        "स्वर्ग को सामान्यतः किस रूप में वर्णित किया जाता है?",
      options: [
        "एक दिव्य लोक",
        "एक हथियार",
        "एक नदी",
        "एक पर्वत",
      ],
      answer: 0,
      explanation:
        "स्वर्ग को सामान्यतः एक दिव्य लोक के रूप में वर्णित किया जाता है।",
    },
    {
      id: 4,
      question:
        "नरक को सामान्यतः किससे जोड़ा जाता है?",
      options: [
        "एक स्वर्गीय उद्यान",
        "दंड के लोक से",
        "एक उत्सव से",
        "एक हथियार से",
      ],
      answer: 1,
      explanation:
        "नरक को सामान्यतः दंड से जुड़े लोक के रूप में वर्णित किया जाता है।",
    },
    {
      id: 5,
      question:
        "त्रिमूर्ति में संरक्षण से किसे जोड़ा जाता है?",
      options: ["विष्णु", "ब्रह्मा", "यम", "अग्नि"],
      answer: 0,
      explanation:
        "विष्णु को पारंपरिक रूप से संरक्षण से जोड़ा जाता है।",
    },
    {
      id: 6,
      question:
        "त्रिमूर्ति में संहार और परिवर्तन से किसे जोड़ा जाता है?",
      options: ["ब्रह्मा", "शिव", "इंद्र", "सूर्य"],
      answer: 1,
      explanation:
        "शिव को पारंपरिक रूप से संहार और परिवर्तन से जोड़ा जाता है।",
    },
    {
      id: 7,
      question:
        "धर्म शब्द का व्यापक अर्थ क्या हो सकता है?",
      options: [
        "एक हथियार",
        "कर्तव्य, आचरण या धार्मिक व्यवस्था",
        "एक ग्रह",
        "एक त्योहार",
      ],
      answer: 1,
      explanation:
        "धर्म के व्यापक अर्थों में कर्तव्य, आचरण और उचित व्यवस्था शामिल हो सकते हैं।",
    },
    {
      id: 8,
      question:
        "किस देवता को सामान्यतः चार सिरों के साथ दर्शाया जाता है?",
      options: ["ब्रह्मा", "यम", "विष्णु", "अग्नि"],
      answer: 0,
      explanation:
        "ब्रह्मा को सामान्यतः चार सिरों के साथ दर्शाया जाता है।",
    },
    {
      id: 9,
      question:
        "यम से पारंपरिक रूप से किस वाहन को जोड़ा जाता है?",
      options: ["मोर", "भैंसा", "हंस", "सिंह"],
      answer: 1,
      explanation:
        "यम को पारंपरिक रूप से भैंसे पर सवार दिखाया जाता है।",
    },
    {
      id: 10,
      question:
        "इस क्विज़ का उद्देश्य क्या है?",
      options: [
        "वास्तविक भाग्य तय करना",
        "पौराणिक ज्ञान-खेल देना",
        "धार्मिक शिक्षा को बदलना",
        "कानूनी निर्णय करना",
      ],
      answer: 1,
      explanation:
        "यह पौराणिक ज्ञान-आधारित गेम है, वास्तविक धार्मिक निर्णय नहीं।",
    },
  ],

  or: [
    {
      id: 1,
      question:
        "ପାରମ୍ପରିକ ଭାବେ ମୃତ୍ୟୁ ଓ ନ୍ୟାୟ ସହ କାହାକୁ ଯୋଡ଼ାଯାଏ?",
      options: ["ବ୍ରହ୍ମା", "ଯମ", "ବିଷ୍ଣୁ", "ଅଗ୍ନି"],
      answer: 1,
      explanation:
        "ଯମଙ୍କୁ ପାରମ୍ପରିକ ଭାବେ ମୃତ୍ୟୁ ଓ ନ୍ୟାୟ ସହ ଯୋଡ଼ାଯାଏ।",
    },
    {
      id: 2,
      question:
        "ତ୍ରିମୂର୍ତ୍ତିରେ ସୃଷ୍ଟିକର୍ତ୍ତା ଭାବେ କାହାକୁ ମନାଯାଏ?",
      options: ["ଶିବ", "ଇନ୍ଦ୍ର", "ବ୍ରହ୍ମା", "ସୂର୍ଯ୍ୟ"],
      answer: 2,
      explanation:
        "ବ୍ରହ୍ମାଙ୍କୁ ତ୍ରିମୂର୍ତ୍ତିରେ ସୃଷ୍ଟିକର୍ତ୍ତା ଭାବେ ମନାଯାଏ।",
    },
    {
      id: 3,
      question:
        "ସ୍ୱର୍ଗକୁ ସାଧାରଣତଃ କିପରି ବର୍ଣ୍ଣନା କରାଯାଏ?",
      options: [
        "ଏକ ଦିବ୍ୟ ଲୋକ",
        "ଏକ ଅସ୍ତ୍ର",
        "ଏକ ନଦୀ",
        "ଏକ ପର୍ବତ",
      ],
      answer: 0,
      explanation:
        "ସ୍ୱର୍ଗକୁ ସାଧାରଣତଃ ଏକ ଦିବ୍ୟ ଲୋକ ଭାବେ ବର୍ଣ୍ଣନା କରାଯାଏ।",
    },
    {
      id: 4,
      question:
        "ନରକ ସାଧାରଣତଃ କାହା ସହ ସମ୍ପର୍କିତ?",
      options: [
        "ଏକ ସ୍ୱର୍ଗୀୟ ଉଦ୍ୟାନ",
        "ଦଣ୍ଡ ସହ ଜଡିତ ଲୋକ",
        "ଏକ ପର୍ବ",
        "ଏକ ଅସ୍ତ୍ର",
      ],
      answer: 1,
      explanation:
        "ନରକକୁ ସାଧାରଣତଃ ଦଣ୍ଡ ସହ ଜଡିତ ଲୋକ ଭାବେ ବର୍ଣ୍ଣନା କରାଯାଏ।",
    },
    {
      id: 5,
      question:
        "ତ୍ରିମୂର୍ତ୍ତିରେ ସଂରକ୍ଷଣ ସହ କାହାକୁ ଯୋଡ଼ାଯାଏ?",
      options: ["ବିଷ୍ଣୁ", "ବ୍ରହ୍ମା", "ଯମ", "ଅଗ୍ନି"],
      answer: 0,
      explanation:
        "ବିଷ୍ଣୁଙ୍କୁ ସାଧାରଣତଃ ସଂରକ୍ଷଣ ସହ ଯୋଡ଼ାଯାଏ।",
    },
    {
      id: 6,
      question:
        "ତ୍ରିମୂର୍ତ୍ତିରେ ସଂହାର ଓ ପରିବର୍ତ୍ତନ ସହ କାହାକୁ ଯୋଡ଼ାଯାଏ?",
      options: ["ବ୍ରହ୍ମା", "ଶିବ", "ଇନ୍ଦ୍ର", "ସୂର୍ଯ୍ୟ"],
      answer: 1,
      explanation:
        "ଶିବଙ୍କୁ ସଂହାର ଓ ପରିବର୍ତ୍ତନ ସହ ଯୋଡ଼ାଯାଏ।",
    },
    {
      id: 7,
      question:
        "ଧର୍ମର ବ୍ୟାପକ ଅର୍ଥ କ'ଣ ହୋଇପାରେ?",
      options: [
        "ଏକ ଅସ୍ତ୍ର",
        "କର୍ତ୍ତବ୍ୟ, ଆଚରଣ ବା ନ୍ୟାୟସଙ୍ଗତ ବ୍ୟବସ୍ଥା",
        "ଏକ ଗ୍ରହ",
        "ଏକ ପର୍ବ",
      ],
      answer: 1,
      explanation:
        "ଧର୍ମର ବ୍ୟାପକ ଅର୍ଥ ମଧ୍ୟରେ କର୍ତ୍ତବ୍ୟ ଓ ଉଚିତ ଆଚରଣ ରହିପାରେ।",
    },
    {
      id: 8,
      question:
        "କେଉଁ ଦେବତାଙ୍କୁ ସାଧାରଣତଃ ଚାରିଟି ମୁଣ୍ଡ ସହ ଦେଖାଯାଏ?",
      options: ["ବ୍ରହ୍ମା", "ଯମ", "ବିଷ୍ଣୁ", "ଅଗ୍ନି"],
      answer: 0,
      explanation:
        "ବ୍ରହ୍ମାଙ୍କୁ ସାଧାରଣତଃ ଚାରିଟି ମୁଣ୍ଡ ସହ ଦେଖାଯାଏ।",
    },
    {
      id: 9,
      question:
        "ଯମଙ୍କ ସହ ପାରମ୍ପରିକ ଭାବେ କେଉଁ ବାହନକୁ ଯୋଡ଼ାଯାଏ?",
      options: ["ମୟୂର", "ମଇଁଷି", "ହଂସ", "ସିଂହ"],
      answer: 1,
      explanation:
        "ଯମଙ୍କୁ ପାରମ୍ପରିକ ଭାବେ ମଇଁଷି ଉପରେ ବସିଥିବା ଦେଖାଯାଏ।",
    },
    {
      id: 10,
      question:
        "ଏହି କୁଇଜର ମୁଖ୍ୟ ଉଦ୍ଦେଶ୍ୟ କ'ଣ?",
      options: [
        "ବାସ୍ତବ ଭାଗ୍ୟ ନିର୍ଣ୍ଣୟ",
        "ପୁରାଣ ପ୍ରେରିତ ଜ୍ଞାନ ଖେଳ",
        "ଧାର୍ମିକ ଶିକ୍ଷା ବଦଳାଇବା",
        "ଆଇନଗତ ନିର୍ଣ୍ଣୟ",
      ],
      answer: 1,
      explanation:
        "ଏହା ଏକ ପୁରାଣ ପ୍ରେରିତ ଜ୍ଞାନ ଖେଳ, ବାସ୍ତବ ଧାର୍ମିକ ନ୍ୟାୟ ନୁହେଁ।",
    },
  ],
};

const FALLBACK_CODE = "hi";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function buildQuestion(base: Question): Question {
  const pairs = base.options.map((option, index) => ({
    option,
    index,
  }));

  const shuffled = shuffle(pairs);

  return {
    ...base,
    options: shuffled.map((item) => item.option),
    answer: shuffled.findIndex(
      (item) => item.index === base.answer
    ),
  };
}

export default function MindraGamesClient() {
  const [language, setLanguage] = useState("hi");

  const [started, setStarted] = useState(false);

  const [question, setQuestion] = useState<Question | null>(null);

  const [selected, setSelected] = useState<number | null>(null);

  const [judgment, setJudgment] = useState<
    "correct" | "wrong" | null
  >(null);

  const [episode, setEpisode] = useState(1);

  const [episodeScore, setEpisodeScore] = useState(0);

  const [episodeAnswered, setEpisodeAnswered] = useState(0);

  const [finished, setFinished] = useState(false);

  const [playedIds, setPlayedIds] = useState<number[]>([]);

  const [mediaError, setMediaError] = useState<string | null>(
    null
  );

  const answerVideoRef = useRef<HTMLVideoElement | null>(null);

  const scoreVideoRef = useRef<HTMLVideoElement | null>(null);

  const t = I18N[language] ?? I18N.en;

  const pool = FACTS[language] ?? FACTS[FALLBACK_CODE];

  const nextFreshQuestion = (ids: number[]) => {
    const unused = pool.filter(
      (item) => !ids.includes(item.id)
    );

    const source =
      unused.length > 0
        ? unused
        : pool;

    const base =
      source[Math.floor(Math.random() * source.length)];

    return buildQuestion(base);
  };

  const languageLabel = useMemo(() => {
    const item = LANGUAGES.find(
      (languageItem) => languageItem.code === language
    );

    return item
      ? `${item.name} · ${item.native}`
      : language;
  }, [language]);

  const progress = Math.min(
    100,
    Math.round(
      (episodeAnswered / QUESTIONS_PER_EPISODE) * 100
    )
  );

  const mediaSrc =
    judgment === "wrong"
      ? "/games/videos/wrong-answer.mp4"
      : judgment === "correct"
        ? "/games/videos/correct-answer.mp4"
        : null;

  function startGame() {
    const first = nextFreshQuestion([]);

    setStarted(true);

    setFinished(false);

    setEpisode(1);

    setEpisodeScore(0);

    setEpisodeAnswered(0);

    setPlayedIds([first.id]);

    setSelected(null);

    setJudgment(null);

    setMediaError(null);

    setQuestion(first);
  }

  function changeLanguage(nextLanguage: string) {
    setLanguage(nextLanguage);

    setStarted(false);

    setFinished(false);

    setQuestion(null);

    setSelected(null);

    setJudgment(null);

    setPlayedIds([]);

    setEpisode(1);

    setEpisodeScore(0);

    setEpisodeAnswered(0);

    setMediaError(null);
  }

  function answerQuestion(optionIndex: number) {
    if (!question || selected !== null) return;

    const correct =
      optionIndex === question.answer;

    setSelected(optionIndex);

    setJudgment(correct ? "correct" : "wrong");

    setEpisodeAnswered(
      (value) => value + 1
    );

    if (correct) {
      setEpisodeScore(
        (value) => value + 1
      );
    }

    setMediaError(null);

    window.setTimeout(() => {
      if (answerVideoRef.current) {
        answerVideoRef.current.currentTime = 0;

        answerVideoRef.current
          .play()
          .catch(() => {
            // Browser autoplay may require user interaction.
          });
      }
    }, 50);
  }

  function continueAfterJudgment() {
    if (!question) return;

    const nextAnsweredCount =
      episodeAnswered;

    if (
      nextAnsweredCount >=
      QUESTIONS_PER_EPISODE
    ) {
      setFinished(true);

      setJudgment(null);

      setSelected(null);

      setMediaError(null);

      window.setTimeout(() => {
        if (scoreVideoRef.current) {
          scoreVideoRef.current.currentTime = 0;

          scoreVideoRef.current.muted = false;

          scoreVideoRef.current
            .play()
            .catch(() => {
              // Browser autoplay may require user interaction.
            });
        }
      }, 100);

      return;
    }

    const next = nextFreshQuestion(playedIds);

    setPlayedIds((ids) =>
      Array.from(
        new Set([
          ...ids,
          next.id,
        ])
      )
    );

    setQuestion(next);

    setSelected(null);

    setJudgment(null);

    setMediaError(null);
  }

  function goToNextEpisode() {
    const next = nextFreshQuestion(playedIds);

    setEpisode(
      (value) => value + 1
    );

    setEpisodeScore(0);

    setEpisodeAnswered(0);

    setQuestion(next);

    setPlayedIds((ids) =>
      Array.from(
        new Set([
          ...ids,
          next.id,
        ])
      )
    );

    setSelected(null);

    setJudgment(null);

    setFinished(false);

    setMediaError(null);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <SiteHeader />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.22),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(6,182,212,0.16),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.18),transparent_38%),linear-gradient(135deg,#050816,#0a1025,#050816)]" />

        <div className="absolute -left-32 top-32 h-80 w-80 animate-pulse rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="absolute -right-32 top-52 h-96 w-96 animate-pulse rounded-full bg-cyan-400/10 blur-3xl [animation-delay:2s]" />
      </div>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">

        {/* =====================================================
            START SCREEN
        ====================================================== */}

        {!started ? (
          <div className="mx-auto max-w-4xl text-center">

            <div className="inline-flex rounded-full border border-purple-400/20 bg-purple-400/10 px-4 py-2 text-sm font-bold text-purple-300">
              {t.badge}
            </div>

            <h1 className="mt-7 text-5xl font-black tracking-tight md:text-7xl">
              {t.title}

              <span className="bg-gradient-to-r from-amber-300 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {` ${t.title2}`}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/55">
              {t.subtitle}
            </p>

            {/* LANGUAGE */}

            <div className="mx-auto mt-8 max-w-md text-left">

              <label className="mb-2 block text-sm font-bold text-white/60">
                {t.language}
              </label>

              <select
                value={language}
                onChange={(event) =>
                  changeLanguage(
                    event.target.value
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none backdrop-blur-xl focus:border-cyan-400/40"
              >
                {LANGUAGES.map((item) => (
                  <option
                    key={item.code}
                    value={item.code}
                    className="bg-slate-900 text-white"
                  >
                    {item.name} — {item.native}
                  </option>
                ))}
              </select>

            </div>

            {/* GAME FEATURES */}

            <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-3">

              {[
                [
                  "🕉️",
                  "Mythology",
                  "Tradition-inspired questions",
                ],
                [
                  "⚖️",
                  "Judgment",
                  "Correct and incorrect paths",
                ],
                [
                  "🎬",
                  "Video",
                  "Your own short clips",
                ],
              ].map(
                ([icon, heading, text]) => (
                  <div
                    key={heading}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
                  >
                    <div className="text-4xl">
                      {icon}
                    </div>

                    <h2 className="mt-4 font-black">
                      {heading}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/45">
                      {text}
                    </p>
                  </div>
                )
              )}

            </div>

            <button
              onClick={startGame}
              className="mt-10 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-9 py-4 font-black shadow-2xl transition duration-300 hover:-translate-y-1 hover:scale-105"
            >
              {t.begin}
            </button>

            <p className="mx-auto mt-5 max-w-xl text-xs leading-5 text-white/30">
              {t.finalNote}
            </p>

          </div>
        ) : finished ? (

          /* =====================================================
             EPISODE SCORE SCREEN
          ====================================================== */

          <div className="mx-auto max-w-4xl text-center">

            {/* CONTINUOUS FUNNY VIDEO */}

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 shadow-2xl">

              <video
                ref={scoreVideoRef}
                src="/games/videos/just-a-game.mp4"
                controls
                autoPlay
                loop
                muted
                playsInline
                className="aspect-video w-full object-cover"
                onError={() =>
                  setMediaError(
                    "just-a-game.mp4"
                  )
                }
              />

            </div>

            <div className="mt-8 text-7xl">
              🏆
            </div>

            <p className="mt-5 text-sm font-black uppercase tracking-[0.25em] text-cyan-400">
              {t.episode} {episode}
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-5xl">
              {t.episodeComplete}
            </h1>

            <p className="mt-5 text-lg text-white/55">
              {t.questionCount}:{" "}
              <strong className="text-white">
                {episodeAnswered}
              </strong>{" "}
              ·{" "}
              <strong className="text-white">
                {episodeScore}
              </strong>{" "}
              {t.correct}
            </p>

            <div className="mx-auto mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/35">
                {t.score}
              </p>

              <div className="mt-3 text-6xl font-black">
                {episodeScore}/{QUESTIONS_PER_EPISODE}
              </div>

              <p className="mt-3 text-white/45">
                {episodeScore === QUESTIONS_PER_EPISODE
                  ? t.perfect
                  : episodeScore >= 4
                    ? t.excellent
                    : episodeScore >= 3
                      ? t.good
                      : t.learning}
              </p>

            </div>

            {/* JUST A GAME MESSAGE */}

            <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-amber-300/20 bg-amber-400/10 p-6">

              <h2 className="text-2xl font-black text-amber-200">
                {t.justGame}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/55">
                {t.justGameText}
              </p>

            </div>

            {mediaError && (
              <p className="mt-4 text-sm text-red-300">
                Video file not found:{" "}
                {mediaError}
              </p>
            )}

            {/* NEXT EPISODE */}

            <button
              onClick={goToNextEpisode}
              className="mt-8 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 font-black shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-105"
            >
              {t.nextEpisode}
            </button>

            {/* RESTART */}

            <div className="mt-4">

              <button
                onClick={startGame}
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                {t.playAgain}
              </button>

            </div>

            <div className="mt-8">

              <Link
                href="/games"
                className="text-sm font-semibold text-white/45 hover:text-white"
              >
                {t.back}
              </Link>

            </div>

          </div>
        ) : (

          /* =====================================================
             QUESTION SCREEN
          ====================================================== */

          <div className="mx-auto max-w-4xl">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">
                  MindaGames
                </p>

                <h1 className="mt-2 text-3xl font-black">
                  {t.episode} {episode}
                </h1>

                <p className="mt-1 text-sm text-white/40">
                  {languageLabel}
                </p>

              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold">
                {episodeAnswered + 1} /{" "}
                {QUESTIONS_PER_EPISODE}
              </div>

            </div>

            {/* PROGRESS */}

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">

              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                style={{
                  width: `${Math.max(
                    3,
                    progress
                  )}%`,
                }}
              />

            </div>

            {judgment ? (

              /* =================================================
                 JUDGMENT VIDEO
              ================================================== */

              <div
                className={`mt-10 overflow-hidden rounded-[2rem] border p-5 shadow-2xl ${
                  judgment === "correct"
                    ? "border-amber-300/20 bg-amber-400/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >

                <video
                  ref={answerVideoRef}
                  src={mediaSrc ?? undefined}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full rounded-[1.5rem] object-cover"
                  onError={() =>
                    setMediaError(
                      judgment === "correct"
                        ? "correct-answer.mp4"
                        : "wrong-answer.mp4"
                    )
                  }
                />

                <div className="text-center">

                  <div className="mt-7 text-6xl">
                    {judgment === "correct"
                      ? "🪷"
                      : "⚖️"}
                  </div>

                  <h2 className="mt-5 text-4xl font-black">
                    {judgment === "correct"
                      ? t.creator
                      : t.death}
                  </h2>

                  <p className="mx-auto mt-4 max-w-2xl text-white/55">
                    {judgment === "correct"
                      ? t.creatorText
                      : t.deathText}
                  </p>

                  <p className="mx-auto mt-5 max-w-2xl text-sm text-white/40">
                    {question?.explanation}
                  </p>

                  {mediaError && (
                    <p className="mt-4 text-sm text-red-300">
                      Video file not found:{" "}
                      {mediaError}
                    </p>
                  )}

                  <button
                    onClick={
                      continueAfterJudgment
                    }
                    className="mt-8 rounded-2xl bg-white px-8 py-4 font-black text-slate-900 transition hover:scale-105"
                  >
                    {t.continue}
                  </button>

                </div>

              </div>
            ) : question ? (

              /* =================================================
                 QUESTION
              ================================================== */

              <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl md:p-10">

                <div className="text-sm font-bold text-purple-300">
                  {t.question}{" "}
                  {episodeAnswered + 1}
                </div>

                <h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                  {question.question}
                </h2>

                <div className="mt-8 grid gap-4">

                  {question.options.map(
                    (
                      option,
                      optionIndex
                    ) => (
                      <button
                        key={option}
                        onClick={() =>
                          answerQuestion(
                            optionIndex
                          )
                        }
                        className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]"
                      >

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-black text-white/70 group-hover:bg-cyan-400/15 group-hover:text-cyan-300">
                          {String.fromCharCode(
                            65 + optionIndex
                          )}
                        </span>

                        <span className="font-semibold">
                          {option}
                        </span>

                      </button>
                    )
                  )}

                </div>

              </div>

            ) : null}

          </div>
        )}

      </section>
    </main>
  );
}
