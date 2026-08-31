export type IntentType =
  | "JUST_LISTEN"
  | "GIVE_ADVICE"
  | "TELL_ME_WRONG"
  | "BEEN_HERE";

export interface IntentConfig {
  type: IntentType;
  label: string;
  emoji: string;
  tagline: string;
  responderGuidance: string;
  allowLetters: boolean;
}

export const INTENT_CONFIGS: Record<IntentType, IntentConfig> = {
  JUST_LISTEN: {
    type: "JUST_LISTEN",
    label: "Just Listen",
    emoji: "🫂",
    tagline: "I only want to be heard. No advice or judgment.",
    responderGuidance: "Author requested silent listening only. Show support with 'Relate'.",
    allowLetters: false,
  },
  GIVE_ADVICE: {
    type: "GIVE_ADVICE",
    label: "Give Me Advice",
    emoji: "💭",
    tagline: "Tell me what you would do in my shoes.",
    responderGuidance: "Author is seeking grounded, constructive suggestions.",
    allowLetters: true,
  },
  TELL_ME_WRONG: {
    type: "TELL_ME_WRONG",
    label: "Tell Me If I'm Wrong",
    emoji: "🪞",
    tagline: "Be completely honest with me. Am I the problem?",
    responderGuidance: "Author wants an honest reality-check without hostility.",
    allowLetters: true,
  },
  BEEN_HERE: {
    type: "BEEN_HERE",
    label: "Has Anyone Been Here?",
    emoji: "🤝",
    tagline: "I want to hear from someone who went through this.",
    responderGuidance: "Author wants to connect with shared lived experiences.",
    allowLetters: true,
  },
};

export interface Letter {
  id: string;
  secretId: string;
  responderAlias: string; // e.g. "🌊 Ocean Wanderer", "🌿 Quiet Companion", "🍁 Mountain Wanderer"
  content: string;
  createdAt: string;
  authorReply?: string;
  authorRepliedAt?: string;
  isAuthorLetter?: boolean;
}

export interface Secret {
  id: string;
  content: string;
  intent: IntentType;
  createdAt: string;
  authorSessionId: string;
  rawFeltCount: number;
  letters: Letter[];
  isUserAuthor?: boolean;
  hasUserFelt?: boolean;
  hasUserWrittenLetter?: boolean;
  isReported?: boolean;
}

export type QualitativeTier =
  | "Resting among strangers"
  | "A few people related to this"
  | "Many people related to this"
  | "A lot of people felt this too";

export function getQualitativeTier(count: number): QualitativeTier {
  if (count <= 0) return "Resting among strangers";
  if (count <= 5) return "A few people related to this";
  if (count <= 25) return "Many people related to this";
  return "A lot of people felt this too";
}

export type ActiveTab = "deck" | "release" | "inbox";
