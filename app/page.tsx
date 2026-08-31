"use client";

import React, { useState } from "react";
import { ActiveTab, Secret, IntentType } from "@/types";
import { useSanctuaryStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { SecretDeck } from "@/components/deck/SecretDeck";
import { ReleaseComposer } from "@/components/release/ReleaseComposer";
import { AuthorInbox } from "@/components/inbox/AuthorInbox";
import { LetterComposerModal } from "@/components/letters/LetterComposerModal";
import { CrisisModal } from "@/components/safety/CrisisModal";
import { ReportModal } from "@/components/safety/ReportModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { InstallPromptModal } from "@/components/pwa/InstallPromptModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("deck");
  const [activeLetterSecret, setActiveLetterSecret] = useState<Secret | null>(null);
  const [reportSecretId, setReportSecretId] = useState<string | null>(null);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authActionTitle, setAuthActionTitle] = useState("Release your secret");

  const {
    isLoaded,
    userSession,
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
  } = useSanctuaryStore();

  if (!isLoaded) {
    return (
      <div className="min-h-[100dvh] w-full bg-sanctuary-dark flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-sanctuary-accent border-t-transparent animate-spin" />
          <span className="text-xs tracking-wider uppercase text-sanctuary-textMuted font-medium">
            Entering Sanctuary...
          </span>
        </div>
      </div>
    );
  }

  const deckSecrets = getDeckSecrets();
  const authorSecrets = getAuthorSecrets();
  const totalReceivedLetters = authorSecrets.reduce(
    (acc, s) => acc + s.letters.length,
    0
  );

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenCrisis={() => setIsCrisisOpen(true)}
      unreadCount={totalReceivedLetters}
    >
      {/* 1. Deck View */}
      {activeTab === "deck" && (
        <SecretDeck
          secrets={deckSecrets}
          onToggleFeltThis={toggleFeltThis}
          onOpenLetterModal={(secret) => setActiveLetterSecret(secret)}
          onOpenReportModal={(id) => setReportSecretId(id)}
          onMarkSwiped={markSwiped}
          onGoToRelease={() => setActiveTab("release")}
        />
      )}

      {/* 2. Release View */}
      {activeTab === "release" && (
        <ReleaseComposer
          onRelease={(content: string, intent: IntentType) => {
            releaseSecret(content, intent);
          }}
          onTriggerCrisis={() => setIsCrisisOpen(true)}
          isAuthenticated={userSession.isAuthenticated}
          onRequireAuth={() => {
            setAuthActionTitle("release a secret");
            setIsAuthOpen(true);
          }}
          onSuccess={() => setActiveTab("inbox")}
        />
      )}

      {/* 3. Responses View (Inbox) */}
      {activeTab === "inbox" && (
        <AuthorInbox
          secrets={authorSecrets}
          onSendClosureReply={sendClosureReply}
          onBurnSecret={burnSecret}
          onGoToRelease={() => setActiveTab("release")}
        />
      )}

      {/* Modals & Overlays */}
      <LetterComposerModal
        isOpen={!!activeLetterSecret}
        secret={activeLetterSecret}
        onClose={() => setActiveLetterSecret(null)}
        onSubmitLetter={(secretId, content) => {
          writeLetter(secretId, content);
        }}
        onTriggerCrisis={() => {
          setActiveLetterSecret(null);
          setIsCrisisOpen(true);
        }}
        isAuthenticated={userSession.isAuthenticated}
        onRequireAuth={() => {
          setAuthActionTitle("leave a letter");
          setIsAuthOpen(true);
        }}
      />

      <CrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
      />

      <ReportModal
        isOpen={!!reportSecretId}
        secretId={reportSecretId}
        onClose={() => setReportSecretId(null)}
        onReport={(id, reason) => reportSecret(id, reason)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticated={(email) => authenticateUser(email)}
        actionTitle={authActionTitle}
      />

      <InstallPromptModal
        isOpen={showInstallPrompt}
        onClose={dismissInstallPrompt}
      />
    </AppShell>
  );
}
