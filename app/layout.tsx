import type { Metadata } from "next";
import { Geist, Geist_Mono, Shantell_Sans } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import AuthProvider from "@/components/session-provider";

const shantellSans = Shantell_Sans({
  subsets: ["latin"],
  variable: "--font-shantell",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SketchFlow - Draw • Create • Flow",
  description:
    "A modern drawing and sketching app built with Excalidraw. Create beautiful diagrams, sketches, and visual notes with real-time collaboration.",
  keywords: [
    "drawing",
    "sketching",
    "diagrams",
    "excalidraw",
    "collaboration",
    "notes",
    "visual",
  ],
  authors: [{ name: "SketchFlow Team" }],
  creator: "SketchFlow",
  publisher: "SketchFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sketchflow.app"),
  openGraph: {
    title: "SketchFlow - Draw • Create • Flow",
    description:
      "A modern drawing and sketching app built with Excalidraw. Create beautiful diagrams, sketches, and visual notes with real-time collaboration.",
    url: "https://sketchflow.app",
    siteName: "SketchFlow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SketchFlow - Modern Drawing App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SketchFlow - Draw • Create • Flow",
    description:
      "A modern drawing and sketching app built with Excalidraw. Create beautiful diagrams, sketches, and visual notes with real-time collaboration.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body
          className={`${shantellSans.variable} antialiased dotted-background`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-grow min-h-screen pt-20">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
