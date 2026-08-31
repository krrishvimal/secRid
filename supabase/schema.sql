-- ==============================================================================
-- SANCTUARY: PRODUCTION POSTGRESQL SCHEMA & SECURITY RULES (Supabase)
-- ==============================================================================

-- 1. Enable required cryptographic and UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE intent_type AS ENUM ('JUST_LISTEN', 'GIVE_ADVICE', 'TELL_ME_WRONG', 'BEEN_HERE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('ACTIVE', 'FLAGGED_UNDER_REVIEW', 'REMOVED_BY_MOD', 'BURNED_BY_AUTHOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_reason AS ENUM ('HARASSMENT', 'DOXXING_PII', 'HATE_SPEECH', 'EXPLICIT_SEXUAL', 'SELF_HARM', 'SPAM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. SECRETS TABLE
CREATE TABLE IF NOT EXISTS public.secrets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_session_id TEXT NOT NULL,
    content TEXT NOT NULL CHECK (char_length(content) >= 50 AND char_length(content) <= 1500),
    intent intent_type NOT NULL DEFAULT 'GIVE_ADVICE',
    status content_status NOT NULL DEFAULT 'ACTIVE',
    raw_felt_count INTEGER DEFAULT 0 CHECK (raw_felt_count >= 0),
    letter_count INTEGER DEFAULT 0 CHECK (letter_count >= 0),
    report_count INTEGER DEFAULT 0 CHECK (report_count >= 0),
    language_code VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance & Anti-Starvation Discovery Indexes
CREATE INDEX IF NOT EXISTS idx_secrets_active_created ON public.secrets (created_at DESC) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_secrets_liquidity_boost ON public.secrets (letter_count ASC, created_at DESC) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_secrets_author ON public.secrets (author_session_id, created_at DESC);

-- 4. LETTERS (RESPONSES) TABLE
CREATE TABLE IF NOT EXISTS public.letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    secret_id UUID NOT NULL REFERENCES public.secrets(id) ON DELETE CASCADE,
    responder_session_id TEXT NOT NULL,
    responder_alias VARCHAR(64) NOT NULL DEFAULT '🌊 Ocean Stranger',
    content TEXT NOT NULL CHECK (char_length(content) >= 30 AND char_length(content) <= 1000),
    status content_status NOT NULL DEFAULT 'ACTIVE',
    author_reply TEXT CHECK (author_reply IS NULL OR char_length(author_reply) <= 300),
    author_replied_at TIMESTAMP WITH TIME ZONE,
    is_read_by_author BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_letter_per_responder UNIQUE (secret_id, responder_session_id)
);

CREATE INDEX IF NOT EXISTS idx_letters_secret ON public.letters (secret_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_letters_responder ON public.letters (responder_session_id);

-- 5. "I FELT THIS" REACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.felt_this_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    secret_id UUID NOT NULL REFERENCES public.secrets(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_felt_per_session UNIQUE (secret_id, session_id)
);

-- 6. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_session_id TEXT NOT NULL,
    secret_id UUID NOT NULL REFERENCES public.secrets(id) ON DELETE CASCADE,
    reason report_reason NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.felt_this_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Secrets Policies
CREATE POLICY "Public can view active secrets" 
    ON public.secrets FOR SELECT 
    USING (status = 'ACTIVE');

CREATE POLICY "Anyone can release a secret" 
    ON public.secrets FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Authors can burn their own secrets" 
    ON public.secrets FOR DELETE 
    USING (true);

-- Letters Policies
CREATE POLICY "Public can view letters for active secrets" 
    ON public.letters FOR SELECT 
    USING (status = 'ACTIVE');

CREATE POLICY "Anyone can submit a letter" 
    ON public.letters FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Authors can send closure reply" 
    ON public.letters FOR UPDATE 
    USING (true);

-- Reactions Policies
CREATE POLICY "Public can view reactions" 
    ON public.felt_this_reactions FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can relate to a secret" 
    ON public.felt_this_reactions FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Anyone can remove their reaction" 
    ON public.felt_this_reactions FOR DELETE 
    USING (true);

-- Reports Policies
CREATE POLICY "Anyone can submit a report" 
    ON public.reports FOR INSERT 
    WITH CHECK (true);
