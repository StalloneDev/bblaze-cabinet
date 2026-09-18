import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

function formatPhoneWithCountry(phoneStr: string) {
  if (!phoneStr) return "";
  const trimmed = phoneStr.trim();

  if (trimmed.toUpperCase().includes("TOGO") || trimmed.toUpperCase().includes("BENIN")) {
    return trimmed;
  }

  if (trimmed.includes("228") || trimmed.includes("97070472") || trimmed.startsWith("+228")) {
    return `(TOGO) ${trimmed}`;
  }

  if (trimmed.includes("229") || trimmed.includes("0190362323") || trimmed.startsWith("+229")) {
    return `(BENIN) ${trimmed}`;
  }

  return trimmed;
}

export default async function ContactPage() {
  let contact: Awaited<ReturnType<typeof prisma.contactInfo.findFirst>> = null;
  try {
    contact = await prisma.contactInfo.findFirst({ where: { id: "singleton" } });
  } catch {
    // BD inaccessible — on utilise les fallbacks
  }

  const email1 = contact?.email || "contactbblaze@gmail.com";
  const email2 = contact?.email2 || "contact@cabinetbblaze.com";
  const phone1 = contact?.phone || "+228 97 07 04 72";
  const phone2 = contact?.phone2 || "+229 01 90 36 23 23";
  const address = contact?.address || "LOMÉ - COTONOU";
  const whatsappNumber = contact?.whatsappNumber || "+22897070472";
  const whatsappMsg = contact?.whatsappMsg || "Bonjour, je souhaite prendre contact avec le cabinet BBLAZE.";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppButton variant="floating" number={whatsappNumber} message={whatsappMsg} />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground">
              Contactez-Nous
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-soft border-border">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Informations de Contact</CardTitle>
                  <CardDescription>N'hésitez pas à nous contacter par le moyen qui vous convient le mieux</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <div className="space-y-1">
                        {phone1 && (
                          <a
                            href={`tel:${phone1.replace(/\D/g, "")}`}
                            className="block text-muted-foreground hover:text-accent transition-smooth"
                          >
                            {formatPhoneWithCountry(phone1)}
                          </a>
                        )}
                        {phone2 && (
                          <a
                            href={`tel:${phone2.replace(/\D/g, "")}`}
                            className="block text-muted-foreground hover:text-accent transition-smooth"
                          >
                            {formatPhoneWithCountry(phone2)}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <div className="space-y-1">
                        {email1 && (
                          <a
                            href={`mailto:${email1}`}
                            className="block text-muted-foreground hover:text-accent transition-smooth"
                          >
                            {email1}
                          </a>
                        )}
                        {email2 && (
                          <a
                            href={`mailto:${email2}`}
                            className="block text-muted-foreground hover:text-accent transition-smooth"
                          >
                            {email2}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horaires d'ouverture</h3>
                      <p className="text-muted-foreground">
                        Lundi - Vendredi: 9h00 - 18h00<br />
                        Samedi: Sur rendez-vous<br />
                        Dimanche: Fermé
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-border bg-gradient-to-br from-accent/5 to-accent/10">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-serif font-bold mb-4">Contact Rapide via WhatsApp</h3>
                  <p className="text-muted-foreground mb-4">
                    Pour une réponse rapide, contactez-nous directement sur WhatsApp
                  </p>
                  <WhatsAppButton 
                    number={whatsappNumber}
                    message={whatsappMsg}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="shadow-soft border-border">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Envoyez-nous un Message</CardTitle>
                <CardDescription>Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais</CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm subject="Demande de contact depuis le site web" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
