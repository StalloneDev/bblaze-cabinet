"use client";

import { Button } from "@/components/ui/button";
import { Linkedin, Link as LinkIcon, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // If no URL is provided, use the window's current URL
    setCurrentUrl(url || window.location.href);
  }, [url]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-muted-foreground mr-2">Partager :</span>
      
      {/* LinkedIn */}
      <Button
        variant="outline"
        size="sm"
        className="text-[#0A66C2] border-[#0A66C2]/20 hover:bg-[#0A66C2]/10 transition-smooth rounded-full"
        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')}
      >
        <Linkedin className="w-4 h-4 mr-2" />
        LinkedIn
      </Button>

      {/* WhatsApp */}
      <Button
        variant="outline"
        size="sm"
        className="text-[#25D366] border-[#25D366]/20 hover:bg-[#25D366]/10 transition-smooth rounded-full"
        onClick={() => window.open(`https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`, '_blank')}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>

      {/* Copy Link */}
      <Button
        variant="outline"
        size="sm"
        className="text-foreground transition-smooth rounded-full"
        onClick={handleCopyLink}
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        {copied ? "Lien copié !" : "Copier le lien"}
      </Button>
    </div>
  );
}
