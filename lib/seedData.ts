import { Secret } from "@/types";

export const INITIAL_SEEDS: Secret[] = [
  {
    id: "seed-1",
    content:
      "I've been pretending to love the career path my parents sacrificed everything to fund. Every morning I wake up feeling like a fraud living someone else's dream, but admitting it would break their hearts.",
    intent: "GIVE_ADVICE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    authorSessionId: "seed-author-1",
    rawFeltCount: 42,
    letters: [
      {
        id: "letter-seed-1",
        secretId: "seed-1",
        responderAlias: "🌿 Quiet Companion",
        content:
          "I was in the exact same spot at 26. I worked in corporate finance for 4 years just to make my father proud. When I finally told them I was switching to design, they were shocked for 2 months—then they realized seeing me alive and happy was all they actually wanted. Don't sacrifice 40 years of your life for 2 months of their temporary discomfort.",
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        authorReply: "Reading this brought tears to my eyes. Thank you for giving me the courage to plan the talk.",
        authorRepliedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ],
  },
  {
    id: "seed-2",
    content:
      "I secretly feel relieved when my long-term friends cancel plans. I love them dearly, but the emotional exhaustion of masking my current depression around them has become completely unbearable.",
    intent: "JUST_LISTEN",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    authorSessionId: "seed-author-2",
    rawFeltCount: 128,
    letters: [],
  },
  {
    id: "seed-3",
    content:
      "My best friend of 8 years got engaged, and instead of pure joy, my very first raw reaction was a wave of jealousy and fear of being left behind. I feel like a horrible person for feeling this.",
    intent: "TELL_ME_WRONG",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    authorSessionId: "seed-author-3",
    rawFeltCount: 64,
    letters: [
      {
        id: "letter-seed-3",
        secretId: "seed-3",
        responderAlias: "🍁 Autumn Wanderer",
        content:
          "You are not a horrible person. Jealousy in close friendships is rarely about wanting them to fail; it's almost always grief about the changing dynamic of your own connection and a mirror to your own unspoken desires. Forgive yourself for having a human reflex, then choose to show up with love.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ],
  },
  {
    id: "seed-4",
    content:
      "I walked away from a comfortable 6-year relationship because I felt a quiet emptiness inside, even though they did nothing wrong. Everyone thinks I'm reckless. Did anyone else leave a 'good on paper' relationship and find peace?",
    intent: "BEEN_HERE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    authorSessionId: "seed-author-4",
    rawFeltCount: 89,
    letters: [
      {
        id: "letter-seed-4",
        secretId: "seed-4",
        responderAlias: "🌊 Ocean Stranger",
        content:
          "I left a 5-year relationship that was safe and pleasant. For the first year, I questioned my sanity every single week. But 3 years later, I found someone with whom I don't feel that lingering hollow ache. Staying out of guilt is a slow poison for both people.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      },
    ],
  },
  {
    id: "seed-5",
    content:
      "I'm 31 and secretly have zero savings because I spent the last 5 years secretly bailing out my sibling's failed ventures. Now I have to start from square one and nobody in my family even says thank you.",
    intent: "GIVE_ADVICE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    authorSessionId: "seed-author-5",
    rawFeltCount: 31,
    letters: [], // 0 letters -> boosted by anti-starvation algorithm!
  },
];
