"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { submitContactMessageAction } from "@/app/actions";

interface ContactFormProps {
  subject?: string;
}

const ContactForm = ({ subject = "Demande d'information" }: ContactFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Protection Honeypot Anti-Spam
    if (honeypot.trim()) {
      toast({
        title: "Message envoyé !",
        description: "Votre message a été enregistré avec succès. Nous vous répondrons dans les plus brefs délais.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setHoneypot("");
      setIsLoading(false);
      return;
    }

    // Validation simple
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await submitContactMessageAction({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: subject,
        message: formData.message,
      });

      if (result.success) {
        toast({
          title: "Message envoyé !",
          description: "Votre message a été enregistré avec succès. Nous vous répondrons dans les plus brefs délais.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur réseau est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Champ Honeypot invisible pour les humains (bloque les robots de spam) */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website_url">Website URL</Label>
        <Input
          id="website_url"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center">
          Nom complet
          <span className="text-destructive font-bold ml-1">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Jean Dupont"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          maxLength={100}
          className="transition-smooth focus:border-accent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center">
          Email
          <span className="text-destructive font-bold ml-1">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="jean.dupont@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          maxLength={255}
          className="transition-smooth focus:border-accent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+33 1 23 45 67 89"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          maxLength={20}
          className="transition-smooth focus:border-accent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="flex items-center">
          Message
          <span className="text-destructive font-bold ml-1">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Décrivez votre demande..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          maxLength={1000}
          rows={6}
          className="transition-smooth focus:border-accent resize-none"
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
          <span>* Veuillez détailler votre situation juridique.</span>
          <span>{formData.message.length}/1000 caractères</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-medium transition-bounce hover:scale-[1.01]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Envoyer le message"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        <span className="text-destructive font-bold mr-1">*</span>Indique un champ obligatoire. Vos données sont enregistrées en toute sécurité pour nous permettre de vous recontacter.
      </p>
    </form>
  );
};

export default ContactForm;
