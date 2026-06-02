import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Fresh content on contact edit

export default async function ContactPage() {
  const contact = await prisma.contactInfo.findFirst({
    where: { id: "singleton" },
  });

  const email = contact?.email || "contact@bblaze.fr";
  const phone = contact?.phone || "+33 1 23 45 67 89";
  const address = contact?.address || "123 Avenue de la Justice, 75001 Paris, France";
  const whatsappNumber = contact?.whatsappNumber || "+33123456789";
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
                      <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-muted-foreground hover:text-accent transition-smooth">
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href={`mailto:${email}`} className="text-muted-foreground hover:text-accent transition-smooth">
                        {email}
                      </a>
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
