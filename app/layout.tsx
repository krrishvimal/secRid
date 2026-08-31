import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export const metadata: Metadata = {
  title: "Sanctuary — Anonymous Secret Deck",
  description:
    "Say what you cannot say anywhere else. Anonymous confessions and human perspectives.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sanctuary",
  },
};

export const viewport: Viewport = {
  themeColor: "#090A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        {/* Automatic Chunk Auto-Recovery Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e && e.message && (e.message.indexOf('Loading chunk') !== -1 || e.message.indexOf('ChunkLoadError') !== -1)) {
                  if (!window.sessionStorage.getItem('sanctuary_chunk_auto_heal')) {
                    window.sessionStorage.setItem('sanctuary_chunk_auto_heal', '1');
                    window.location.reload();
                  }
                }
              });
            `,
          }}
        />
      </head>
      <body className="bg-sanctuary-dark text-slate-100 min-h-[100dvh] overflow-x-hidden antialiased select-none">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
