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
import Image from "next/image";

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
        message={`Bonjour, je souhaite obtenir des informations sur votre service : ${service.title}.`}
      />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-smooth mb-8 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          {/* Grille principale en 2 colonnes côte à côte */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Colonne de gauche (Détails et Expertise du Service) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8 animate-in fade-in duration-700">
              
              {/* Grande image de couverture du service */}
              <div className="h-64 sm:h-96 w-full relative overflow-hidden rounded-2xl shadow-medium bg-muted">
                <Image
                  src={service.imageUrl || `/services/${service.id}.png`}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                
                {/* Icône et titre superposés dans l'image de couverture */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 text-white">
                  <div className="p-3 rounded-xl bg-background/25 backdrop-blur-md border border-white/20 shadow-md">
                    <IconComponent className="w-10 h-10 text-accent" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                      {service.title}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Notre Expertise */}
              <Card className="shadow-soft border-border bg-card/65 backdrop-blur-sm">
                <CardContent className="pt-6 space-y-4">
                  <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-accent" />
                    Notre Expertise
                  </h2>
                  <div className="h-px bg-border my-2" />
                  {contentData.expertise.map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </CardContent>
              </Card>

              {/* Domaines d'Intervention */}
              {contentData.bulletPoints.length > 0 && (
                <Card className="shadow-soft border-border bg-card/65 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-serif font-bold mb-4 text-foreground flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-accent" />
                      Domaines d'Intervention
                    </h2>
                    <div className="h-px bg-border my-2" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {contentData.bulletPoints.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                          <span className="text-muted-foreground text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Colonne de droite (Sidebar de Contact Collante) */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 animate-in fade-in duration-700 delay-150">
              <Card className="shadow-medium border-accent/20 bg-gradient-to-br from-cream/40 to-accent/5 backdrop-blur-sm overflow-hidden">
                <div className="bg-primary px-6 py-5 text-center text-primary-foreground border-b border-accent/15">
                  <h2 className="text-xl font-serif font-bold">Demander ce Service</h2>
                  <p className="text-xs text-muted-foreground/80 mt-1 max-w-xs mx-auto">
                    Bénéficiez de notre expertise en {service.title} pour sécuriser vos dossiers.
                  </p>
                </div>
                
                <CardContent className="p-6 space-y-6">
                  {/* Actions directes rapides */}
                  <div className="flex flex-col gap-3">
                    <WhatsAppButton 
                      number={contact?.whatsappNumber}
                      message={`Bonjour, je souhaite démarrer une consultation concernant votre prestation : ${service.title}.`}
                    />
                    <Button
                      asChild
                      variant="outline"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full py-5 text-xs font-semibold"
                    >
                      <a href={`mailto:${contact?.email || "contact@bblaze.fr"}?subject=Demande de service - ${encodeURIComponent(service.title)}`}>
                        Envoyer un E-mail
                      </a>
                    </Button>
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">ou formulaire</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  {/* Formulaire complet compact */}
                  <div className="space-y-4">
                    <ContactForm subject={`Demande de service - ${service.title}`} />
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
