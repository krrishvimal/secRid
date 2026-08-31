"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isChunkError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    const isChunk =
      error.name === "ChunkLoadError" ||
      error.message?.includes("Loading chunk") ||
      error.message?.includes("Minified React error");
    return { hasError: true, isChunkError: isChunk };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Captured error:", error, errorInfo);

    // Auto-reload once on ChunkLoadError
    if (
      error.name === "ChunkLoadError" ||
      error.message?.includes("Loading chunk")
    ) {
      const reloadedKey = "sanctuary_auto_reloaded_chunk";
      if (!sessionStorage.getItem(reloadedKey)) {
        sessionStorage.setItem(reloadedKey, "true");
        window.location.reload();
      }
    }
  }

  private handleManualRefresh = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("sanctuary_auto_reloaded_chunk");
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] w-full bg-[#090A0F] flex items-center justify-center p-6 text-slate-100 text-center">
          <div className="w-full max-w-sm bg-[#12151E] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-full bg-sanctuary-accent/20 text-sanctuary-accent flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Sanctuary was updated</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                A fresh update was published to the sanctuary. Tap below to reload the latest version.
              </p>
            </div>

            <button
              onClick={this.handleManualRefresh}
              className="w-full py-3.5 rounded-2xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Sanctuary
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
