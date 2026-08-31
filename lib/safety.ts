// Sanctuary Trust & Safety Engine (Client + Edge Pre-Publication Filter)

export interface SafetyCheckResult {
  passed: boolean;
  isCrisis: boolean;
  errorReason?: string;
  matchedCategory?: "PII" | "TOXICITY" | "CRISIS" | "SPAM";
}

// Phone number regex (Indian, US, Intl formats)
const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\s-]{7,13}/g;

// Email regex
const EMAIL_REGEX = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g;

// Social handles (@username, insta, snapchat, linkedin)
const HANDLE_REGEX = /(@[a-zA-Z0-9_]{3,30}|instagram\.com\/[a-zA-Z0-9_]+|snapchat\.com\/add\/[a-zA-Z0-9_]+)/gi;

// Crisis / Self-harm patterns
const CRISIS_KEYWORDS = [
  "kill myself",
  "suicide",
  "want to die",
  "end my life",
  "ending it all",
  "slit my",
  "hanging myself",
  "no reason to live",
  "better off dead",
  "mar jaunga",
  "mar jaungi",
  "khudkushi",
  "suicidal",
  "overdose on pills",
];

// Severe toxicity and slur lexicon (English + Romanized Hinglish)
const TOXIC_PATTERNS = [
  /\b(rape|murder|doxx|swat|threaten to kill)\b/i,
  /\b(madarchod|bhenchod|chutiya|gandu|harami|bhosdike|randi)\b/i,
  /\b(kill you|burn in hell|die in a fire)\b/i,
];

export function evaluateSafety(text: string): SafetyCheckResult {
  const normalized = text.toLowerCase().trim();

  // 1. Check for Crisis / Self-Harm
  for (const phrase of CRISIS_KEYWORDS) {
    if (normalized.includes(phrase)) {
      return {
        passed: false,
        isCrisis: true,
        matchedCategory: "CRISIS",
        errorReason:
          "It sounds like you're carrying unbearable pain. We want you to be safe.",
      };
    }
  }

  // 2. Check for PII (Phone numbers with at least 8 digits)
  const phoneMatches = text.match(PHONE_REGEX);
  if (phoneMatches) {
    for (const match of phoneMatches) {
      const digitsOnly = match.replace(/\D/g, "");
      if (digitsOnly.length >= 8 && digitsOnly.length <= 13) {
        return {
          passed: false,
          isCrisis: false,
          matchedCategory: "PII",
          errorReason:
            "Please remove phone numbers. Sanctuary is strictly anonymous to protect your privacy.",
        };
      }
    }
  }

  // 3. Check for Email Addresses
  if (EMAIL_REGEX.test(text)) {
    return {
      passed: false,
      isCrisis: false,
      matchedCategory: "PII",
      errorReason:
        "Please remove email addresses to protect your privacy and identity.",
    };
  }

  // 4. Check for Social Handles
  if (HANDLE_REGEX.test(text)) {
    return {
      passed: false,
      isCrisis: false,
      matchedCategory: "PII",
      errorReason:
        "Please remove social media handles (@username, Instagram, Snapchat links).",
    };
  }

  // 5. Check for Toxicity / Severe Slurs
  for (const pattern of TOXIC_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        passed: false,
        isCrisis: false,
        matchedCategory: "TOXICITY",
        errorReason:
          "Your message contains abusive, threatening, or explicit language prohibited by community guidelines.",
      };
    }
  }

  return {
    passed: true,
    isCrisis: false,
  };
}

export const EPHEMERAL_ALIASES = [
  "🌊 Ocean Stranger",
  "🌿 Quiet Companion",
  "🍁 Autumn Wanderer",
  "🌙 Night Listener",
  "🏔️ Mountain Solace",
  "🕊️ Gentle Guide",
  "🌌 Starlight Pilgrim",
  "🍂 River Wanderer",
];

export function getRandomAlias(): string {
  const index = Math.floor(Math.random() * EPHEMERAL_ALIASES.length);
  return EPHEMERAL_ALIASES[index];
}
