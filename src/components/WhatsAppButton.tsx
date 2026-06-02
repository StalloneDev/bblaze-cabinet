import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  message?: string;
  number?: string;
  variant?: "default" | "floating";
  className?: string;
}

const WhatsAppButton = ({ 
  message = "Bonjour, je souhaite obtenir des informations sur vos services juridiques.",
  number,
  variant = "default",
  className = ""
}: WhatsAppButtonProps) => {
  // Use the provided number or default to the original hardcoded France number
  const finalNumber = number ? number.replace(/[\s+]+/g, '') : "33123456789";
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${finalNumber}?text=${encodedMessage}`;

  if (variant === "floating") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-strong hover:scale-110 transition-bounce ${className}`}
        aria-label="Contactez-nous sur WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
      </a>
    );
  }

  return (
    <Button
      asChild
      className={`bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-medium ${className}`}
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="w-5 h-5 mr-2" />
        WhatsApp
      </a>
    </Button>
  );
};

export default WhatsAppButton;
