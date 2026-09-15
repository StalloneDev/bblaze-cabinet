"use client";

import { useEffect, useState } from "react";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export default function GoogleTranslate() {
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState("fr");

  // Détecter la langue active depuis les cookies
  const getActiveLanguage = () => {
    if (typeof document === "undefined") return "fr";
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, val] = cookie.trim().split("=");
      if (name === "googtrans" && val) {
        const parts = val.split("/");
        const lang = parts[parts.length - 1];
        if (lang && LANGUAGES.some((l) => l.code === lang)) {
          return lang;
        }
      }
    }
    return "fr";
  };

  useEffect(() => {
    setMounted(true);
    const active = getActiveLanguage();
    setCurrentLang(active);

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "fr",
              includedLanguages: "fr,en,es,pt,de,ar",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      };
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    if (langCode === currentLang) return;

    setCurrentLang(langCode);

    // Mettre à jour les cookies de traduction Google
    const domain = window.location.hostname;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;

    if (langCode !== "fr") {
      const val = `/fr/${langCode}`;
      document.cookie = `googtrans=${val}; path=/;`;
      document.cookie = `googtrans=${val}; path=/; domain=${domain};`;
    }

    // Déclencher l'événement si le widget est prêt
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }

    // Recharger doucement la page pour appliquer la traduction complète et persistance
    window.location.reload();
  };

  if (!mounted) return null;

  const activeObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative flex items-center">
      {/* Conteneur masqué pour l'élément Google Translate */}
      <div id="google_translate_element" className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2.5 gap-1.5 rounded-lg border border-border bg-card/60 hover:bg-accent/10 hover:text-accent hover:border-accent/40 transition-smooth text-xs font-semibold"
            title="Changer de langue / Change language"
          >
            <Globe className="w-4 h-4 text-accent" />
            <span>{activeObj.flag}</span>
            <span className="uppercase font-bold tracking-wider">{activeObj.code}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 bg-card border-border shadow-strong z-[100]">
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center justify-between cursor-pointer text-sm font-medium ${
                currentLang === lang.code ? "bg-accent/15 text-accent font-bold" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {currentLang === lang.code && <Check className="w-4 h-4 text-accent" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
