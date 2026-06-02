import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Globe, DollarSign, Scale, GraduationCap, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const iconMap: Record<string, React.ComponentType<any>> = {
  Briefcase: Briefcase,
  Users: Users,
  Globe: Globe,
  DollarSign: DollarSign,
  Scale: Scale,
  GraduationCap: GraduationCap,
};

export const revalidate = 0; // Don't cache dynamic service edits

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { id: slug },
  });

  if (!service) {
    notFound();
  }

  // Charger le contact pour les boutons WhatsApp/email
  const contact = await prisma.contactInfo.findFirst({
    where: { id: "singleton" },
  });

  // Analyser le contenu au format JSON
  let contentData: { expertise: string[]; bulletPoints: string[] } = {
    expertise: [],
    bulletPoints: [],
  };

  try {
    contentData = JSON.parse(service.content);
  } catch (e) {
    // Fallback si ce n'est pas du JSON valide
    contentData = {
      expertise: [service.content],
      bulletPoints: [],
    };
  }

  const IconComponent = iconMap[service.icon] || Briefcase;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppButton 
        variant="floating" 
        number={contact?.whatsappNumber}
        message={`Bonjour, je souhaite obtenir des informations sur votre service: ${service.title}.`}
      />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-smooth mb-8">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 mb-16">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 w-fit mx-auto">
                <IconComponent className="w-16 h-16 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {service.description}
              </p>
            </div>

            {/* Description */}
            <Card className="mb-12 shadow-soft border-border">
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-serif font-bold">Notre Expertise</h2>
                {contentData.expertise.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* Services List */}
            {contentData.bulletPoints.length > 0 && (
              <Card className="mb-12 shadow-soft border-border">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-serif font-bold mb-6">Nos Domaines d'Intervention</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contentData.bulletPoints.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA Section */}
            <Card className="shadow-soft border-border bg-gradient-to-br from-cream/50 to-accent/5">
              <CardContent className="pt-6 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-center">Demander ce Service</h2>
                <p className="text-muted-foreground text-center mb-6">
                  Contactez-nous pour discuter de votre dossier et bénéficier de notre expertise en {service.title}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <WhatsAppButton 
                    number={contact?.whatsappNumber}
                    message={`Bonjour, je souhaite démarrer une consultation en ${service.title}.`}
                  />
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <a href={`mailto:${contact?.email || "contact@bblaze.fr"}?subject=Demande de service - ${encodeURIComponent(service.title)}`}>
                      Envoyer un Email
                    </a>
                  </Button>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold mb-4 text-center">Ou remplissez notre formulaire</h3>
                  <ContactForm subject={`Demande de service - ${service.title}`} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
