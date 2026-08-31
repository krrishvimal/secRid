# Sanctuary (secRid) — Anonymous Secret & Venting Platform

> **Say what you cannot say anywhere else.**  
> An intimate, privacy-first, anonymous Progressive Web App (PWA) where people release unspoken thoughts and receive perspective from real humans without identity tracking.

---

## 🌟 Core Philosophy
* **No Identity, No Followers, No Popularity:** Zero user profiles, zero follower counts, zero influencer mechanics, zero public post history.
* **The Secret is the Hero:** Focused single-card discovery deck with 60fps physics. One human voice at a time.
* **Intent-Gated Feedback:** Authors dictate what type of response they need:
  * `[ 🫂 Just Listen ]` — Silent listening only.
  * `[ 💭 Give Me Advice ]` — Actionable, constructive suggestions.
  * `[ 🪞 Tell Me If I'm Wrong ]` — Respectful reality checks.
  * `[ 🤝 Has Anyone Been Here? ]` — Shared lived experiences.
* **100% Real Human Letters:** Strict anti-AI policy for responses. Every letter comes from a living human.
* **Qualitative Resonance:** Replaced dopamine-driven like counts with gentle empathy tiers (*"A few people related"*, *"Many people related"*).
* **Closed-Loop Closure:** Responders write 1 structured letter; authors can send 1 single "Thank You" closure reply before the thread is sealed.

---

## 🛠️ Tech Stack
* **Frontend:** Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS
* **Animations & Gestures:** Framer Motion (60fps spring physics)
* **Icons:** Lucide React
* **Backend / Database:** Supabase (PostgreSQL 15+ with Row-Level Security)
* **Safety Engine:** Edge API regex PII scrubber, Hinglish slur filter, 24/7 crisis helpline interceptor
* **PWA:** Installable mobile Web App Manifest + Service Worker offline caching

---

## 🚀 Quick Start (Local Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) on your browser or mobile phone.

---

## 🔒 Security & Privacy by Design
* All database tables are protected by PostgreSQL **Row-Level Security (RLS)**.
* Pre-publication screening automatically detects and blocks phone numbers, emails, and social media handles.
* Automatic crisis detection connects distressed users immediately to free, 24/7 confidential helplines (AASRA, Vandrevala Foundation, 988, Crisis Text Line).
