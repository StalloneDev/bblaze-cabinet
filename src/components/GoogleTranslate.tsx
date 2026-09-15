"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
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

export default function GoogleTranslate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

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
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      // Fallback avec cookie Google Translate
      document.cookie = `googtrans=/fr/${langCode}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/fr/${langCode}; path=/`;
      window.location.reload();
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative flex items-center">
      {/* Element caché d'initialisation Google Translate */}
      <div id="google_translate_element" className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-lg border border-border bg-card/60 hover:bg-accent/10 hover:text-accent hover:border-accent/40 transition-smooth"
            title="Traduire le site / Change language"
          >
            <Globe className="w-4 h-4" />
            <span className="sr-only">Changer de langue</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 bg-card border-border shadow-strong z-[100]">
          <DropdownMenuItem onClick={() => changeLanguage("fr")} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium">
            <span className="text-base">🇫🇷</span> Français
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("en")} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium">
            <span className="text-base">🇬🇧</span> English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("es")} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium">
            <span className="text-base">🇪🇸</span> Español
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("pt")} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium">
            <span className="text-base">🇵🇹</span> Português
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("de")} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium">
            <span className="text-base">🇩🇪</span> Deutsch
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("ar")} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium">
            <span className="text-base">🇸🇦</span> العربية
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
