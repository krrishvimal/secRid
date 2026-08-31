import { useState, useEffect, useRef } from "react";
import { Secret, Letter, IntentType } from "@/types";
import { INITIAL_SEEDS } from "./seedData";
import { getRandomAlias } from "./safety";
import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

const STORAGE_KEY_SECRETS = "sanctuary_secrets_v1";
const STORAGE_KEY_USER = "sanctuary_user_session_v1";
const STORAGE_KEY_INSTALL_PROMPT = "sanctuary_pwa_install_dismissed";

export interface UserSession {
  sessionId: string;
  isAuthenticated: boolean;
  userEmail?: string;
  hasReleasedSecret: boolean;
  hasReceivedLetter: boolean;
  swipedIds: string[];
  releaseTimestamps: number[];
  letterTimestamps: number[];
}

export function useSanctuaryStore() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [userSession, setUserSession] = useState<UserSession>({
    sessionId: "guest-init",
    isAuthenticated: false,
    hasReleasedSecret: false,
    hasReceivedLetter: false,
    swipedIds: [],
    releaseTimestamps: [],
    letterTimestamps: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Initialize from LocalStorage, BroadcastChannel & Supabase Auth/DB
  useEffect(() => {
    // 1. Setup BroadcastChannel for Instant Multi-Tab Sync
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("sanctuary_realtime_sync");
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === "SECRETS_UPDATED" && Array.isArray(event.data.secrets)) {
          setSecrets(event.data.secrets);
          try {
            localStorage.setItem(STORAGE_KEY_SECRETS, JSON.stringify(event.data.secrets));
          } catch (e) {
            console.error(e);
          }
        }
      };
    }

    // 2. Storage event listener (standard cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_SECRETS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setSecrets(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    async function initStore() {
      try {
        // Load User Session from Storage
        let session: UserSession;
        const storedSession = localStorage.getItem(STORAGE_KEY_USER);
        if (storedSession) {
          session = JSON.parse(storedSession);
          session.releaseTimestamps = session.releaseTimestamps || [];
          session.letterTimestamps = session.letterTimestamps || [];
        } else {
          session = {
            sessionId: `anon-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            isAuthenticated: false,
            hasReleasedSecret: false,
            hasReceivedLetter: false,
            swipedIds: [],
            releaseTimestamps: [],
            letterTimestamps: [],
          };
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session));
        }
        setUserSession(session);

        // Supabase Auth & Cloud Database Integration
        const supabase = getSupabaseClient();
        if (supabase) {
          setIsCloudConnected(true);

          // Check for active Supabase Auth session if any
          try {
            const { data: authData } = await supabase.auth.getSession();
            if (authData?.session?.user) {
              const u = authData.session.user;
              session = {
                ...session,
                sessionId: u.id,
                isAuthenticated: true,
                userEmail: u.email,
              };
              setUserSession(session);
              localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session));
            }
          } catch (authErr) {
            console.warn("Auth check error:", authErr);
          }

          // Fetch Cloud Secrets
          const { data: remoteSecrets, error } = await supabase
            .from("secrets")
            .select("*, letters(*)")
            .eq("status", "ACTIVE")
            .order("created_at", { ascending: false });

          if (!error && remoteSecrets) {
            const mapped: Secret[] = remoteSecrets.map((r: any) => ({
              id: r.id,
              content: r.content,
              intent: r.intent,
              createdAt: r.created_at,
              authorSessionId: r.author_session_id,
              rawFeltCount: r.raw_felt_count || 0,
              letters: (r.letters || []).map((l: any) => ({
                id: l.id,
                secretId: l.secret_id,
                responderAlias: l.responder_alias || "🌊 Ocean Stranger",
                content: l.content,
                createdAt: l.created_at,
                authorReply: l.author_reply,
                authorRepliedAt: l.author_replied_at,
              })),
            }));

            // Merge cloud secrets with starter liquidity seeds
            const remoteIds = new Set(mapped.map((s) => s.id));
            const merged = [
              ...mapped,
              ...INITIAL_SEEDS.filter((seed) => !remoteIds.has(seed.id)),
            ];

            setSecrets(merged);
            localStorage.setItem(STORAGE_KEY_SECRETS, JSON.stringify(merged));
          } else {
            loadLocalSecrets();
          }
        } else {
          loadLocalSecrets();
        }

        // Check Install Prompt
        const isDismissed = localStorage.getItem(STORAGE_KEY_INSTALL_PROMPT);
        if (!isDismissed && (session.hasReleasedSecret || session.hasReceivedLetter)) {
          setShowInstallPrompt(true);
        }
      } catch (e) {
        console.error("Storage load error:", e);
        loadLocalSecrets();
      } finally {
        setIsLoaded(true);
      }
    }

    function loadLocalSecrets() {
      const stored = localStorage.getItem(STORAGE_KEY_SECRETS);
      if (stored) {
        setSecrets(JSON.parse(stored));
      } else {
        setSecrets(INITIAL_SEEDS);
        localStorage.setItem(STORAGE_KEY_SECRETS, JSON.stringify(INITIAL_SEEDS));
      }
    }

    initStore();

    // Supabase Auth State Change Listener
    const supabase = getSupabaseClient();
    let authListenerSubscription: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, authSession) => {
        if (authSession?.user) {
          setUserSession((prev) => {
            const updated = {
              ...prev,
              sessionId: authSession.user.id,
              isAuthenticated: true,
              userEmail: authSession.user.email,
            };
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
            return updated;
          });
        }
      });
      authListenerSubscription = data.subscription;
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      if (authListenerSubscription) {
        authListenerSubscription.unsubscribe();
      }
    };
  }, []);

  const persistSecrets = (updated: Secret[]) => {
    setSecrets(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SECRETS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist secrets:", e);
    }

    // Broadcast in real-time to all other open tabs/windows
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: "SECRETS_UPDATED",
          secrets: updated,
        });
      } catch (err) {
        console.error("Broadcast error:", err);
      }
    }
  };

  const persistUserSession = (updated: UserSession) => {
    setUserSession(updated);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist user session:", e);
    }
  };

  // Optional manual auth bridge
  const authenticateUser = (email: string) => {
    const updated: UserSession = {
      ...userSession,
      isAuthenticated: true,
      userEmail: email,
    };
    persistUserSession(updated);
  };

  // Release a new Secret (Rate limited: Max 3 per 24 hours)
  const releaseSecret = (
    content: string,
    intent: IntentType
  ): { success: boolean; errorReason?: string; secret?: Secret } => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const recentReleases = (userSession.releaseTimestamps || []).filter((t) => t > oneDayAgo);

    if (recentReleases.length >= 3) {
      return {
        success: false,
        errorReason:
          "Daily limit reached. To keep the sanctuary thoughtful, you can release up to 3 secrets every 24 hours.",
      };
    }

    const newSecret: Secret = {
      id: `secret-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      content: content.trim(),
      intent,
      createdAt: new Date().toISOString(),
      authorSessionId: userSession.sessionId,
      rawFeltCount: 0,
      letters: [],
      isUserAuthor: true,
    };

    const updatedSecrets = [newSecret, ...secrets];
    persistSecrets(updatedSecrets);

    const updatedSession: UserSession = {
      ...userSession,
      hasReleasedSecret: true,
      releaseTimestamps: [...recentReleases, now],
    };
    persistUserSession(updatedSession);

    // Sync to Supabase Cloud asynchronously
    const supabase = getSupabaseClient();
    if (supabase) {
      (async () => {
        try {
          const { data } = await supabase
            .from("secrets")
            .insert({
              content: newSecret.content,
              intent: newSecret.intent,
              author_session_id: userSession.sessionId,
              status: "ACTIVE",
            })
            .select()
            .single();

          if (data && data.id) {
            newSecret.id = data.id;
          }
        } catch (err) {
          console.warn("Supabase background sync notice:", err);
        }
      })();
    }

    return { success: true, secret: newSecret };
  };

  // Relate / "I Felt This"
  const toggleFeltThis = async (secretId: string) => {
    const updated = secrets.map((s) => {
      if (s.id === secretId) {
        const currentlyFelt = !!s.hasUserFelt;
        return {
          ...s,
          hasUserFelt: !currentlyFelt,
          rawFeltCount: currentlyFelt ? Math.max(0, s.rawFeltCount - 1) : s.rawFeltCount + 1,
        };
      }
      return s;
    });
    persistSecrets(updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from("felt_this_reactions").insert({
          secret_id: secretId,
          session_id: userSession.sessionId,
        });
      } catch (err) {
        console.warn("Supabase reaction sync error:", err);
      }
    }
  };

  // Write a Letter (Rate limited: Max 10 per hour)
  const writeLetter = (
    secretId: string,
    content: string
  ): { success: boolean; errorReason?: string; letter?: Letter } => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const recentLetters = (userSession.letterTimestamps || []).filter((t) => t > oneHourAgo);

    if (recentLetters.length >= 10) {
      return {
        success: false,
        errorReason:
          "Letter limit reached. You can write up to 10 letters per hour to ensure each response is thoughtful.",
      };
    }

    const alias = getRandomAlias();
    const newLetter: Letter = {
      id: `letter-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      secretId,
      responderAlias: alias,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      isAuthorLetter: false,
    };

    const updated = secrets.map((s) => {
      if (s.id === secretId) {
        return {
          ...s,
          letters: [...s.letters, newLetter],
          hasUserWrittenLetter: true,
        };
      }
      return s;
    });
    persistSecrets(updated);

    const updatedSession: UserSession = {
      ...userSession,
      letterTimestamps: [...recentLetters, now],
    };
    persistUserSession(updatedSession);

    const supabase = getSupabaseClient();
    if (supabase) {
      (async () => {
        try {
          await supabase.from("letters").insert({
            secret_id: secretId,
            responder_session_id: userSession.sessionId,
            responder_alias: alias,
            content: content.trim(),
            status: "ACTIVE",
          });
        } catch (err) {
          console.warn("Supabase letter sync notice:", err);
        }
      })();
    }

    return { success: true, letter: newLetter };
  };

  // 1-Turn Closure Reply
  const sendClosureReply = async (secretId: string, letterId: string, replyText: string) => {
    const updated = secrets.map((s) => {
      if (s.id === secretId) {
        const updatedLetters = s.letters.map((l) => {
          if (l.id === letterId) {
            return {
              ...l,
              authorReply: replyText.trim(),
              authorRepliedAt: new Date().toISOString(),
            };
          }
          return l;
        });
        return { ...s, letters: updatedLetters };
      }
      return s;
    });
    persistSecrets(updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from("letters")
          .update({
            author_reply: replyText.trim(),
            author_replied_at: new Date().toISOString(),
          })
          .eq("id", letterId);
      } catch (err) {
        console.warn("Supabase reply sync error:", err);
      }
    }
  };

  // Burn Secret (Hard Delete)
  const burnSecret = async (secretId: string) => {
    const updated = secrets.filter((s) => s.id !== secretId);
    persistSecrets(updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from("secrets").delete().eq("id", secretId);
      } catch (err) {
        console.warn("Supabase delete sync error:", err);
      }
    }
  };

  // Report Secret
  const reportSecret = async (secretId: string, reason: string) => {
    const updated = secrets.map((s) => {
      if (s.id === secretId) {
        return { ...s, isReported: true };
      }
      return s;
    });
    persistSecrets(updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from("reports").insert({
          secret_id: secretId,
          reporter_session_id: userSession.sessionId,
          reason,
        });
      } catch (err) {
        console.warn("Supabase report sync error:", err);
      }
    }
  };

  const markSwiped = (secretId: string) => {
    if (!userSession.swipedIds.includes(secretId)) {
      const updated = {
        ...userSession,
        swipedIds: [...userSession.swipedIds, secretId],
      };
      persistUserSession(updated);
    }
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem(STORAGE_KEY_INSTALL_PROMPT, "true");
  };

  // Anti-Starvation Deck Ordering
  const getDeckSecrets = (): Secret[] => {
    return secrets
      .filter((s) => !s.isReported)
      .sort((a, b) => {
        const scoreA = (1 / (1 + a.letters.length)) * 2.5 + (a.rawFeltCount > 0 ? 0.5 : 0);
        const scoreB = (1 / (1 + b.letters.length)) * 2.5 + (b.rawFeltCount > 0 ? 0.5 : 0);
        return scoreB - scoreA;
      });
  };

  const getAuthorSecrets = (): Secret[] => {
    return secrets.filter((s) => s.authorSessionId === userSession.sessionId || s.isUserAuthor);
  };

  return {
    secrets,
    userSession,
    isLoaded,
    isCloudConnected,
    showInstallPrompt,
    authenticateUser,
    releaseSecret,
    toggleFeltThis,
    writeLetter,
    sendClosureReply,
    burnSecret,
    reportSecret,
    markSwiped,
    dismissInstallPrompt,
    getDeckSecrets,
    getAuthorSecrets,
  };
}
