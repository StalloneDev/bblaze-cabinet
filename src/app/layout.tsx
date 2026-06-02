import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/Providers";
import "@/index.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bblaze-cabinet-f7zk.vercel.app"),
  title: "BBLAZE - Cabinet Conseil & Expertise Juridique",
  description: "BBLAZE est un cabinet de conseil et de droit spécialisé en ingénierie juridique, ressources humaines, commerce international, recouvrement, médiation et formations. Votre partenaire de confiance.",
  authors: [{ name: "BBLAZE" }],
  openGraph: {
    title: "BBLAZE - Cabinet Conseil & Expertise Juridique",
    description: "BBLAZE est un cabinet de conseil et de droit spécialisé en ingénierie juridique, ressources humaines, commerce international, recouvrement, médiation et formations. Votre partenaire de confiance.",
    url: "https://bblaze-cabinet-f7zk.vercel.app",
    siteName: "BBLAZE",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
        alt: "BBLAZE - Cabinet Conseil & Expertise Juridique",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BBLAZE - Cabinet Conseil & Expertise Juridique",
    description: "BBLAZE est un cabinet de conseil et de droit spécialisé en ingénierie juridique, ressources humaines, commerce international, recouvrement, médiation et formations. Votre partenaire de confiance.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

