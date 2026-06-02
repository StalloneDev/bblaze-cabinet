import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Briefcase,
  Users,
  Globe,
  DollarSign,
  Scale,
  GraduationCap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Associer les chaînes d'icônes aux composants Lucide correspondants
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase: Briefcase,
  Users: Users,
  Globe: Globe,
  DollarSign: DollarSign,
  Scale: Scale,
  GraduationCap: GraduationCap,
};

export const revalidate = 0; // Toujours charger les données fraîches

export default async function IndexPage() {
  // Charger les services et informations de contact depuis Neon !
  const services = await prisma.service.findMany();
  const contact = await prisma.contactInfo.findFirst({
    where: { id: "singleton" },
  });

  const values = [
    {
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque dossier traité",
    },
    {
      title: "Expertise",
      description: "Des juristes expérimentés à votre service",
    },
    {
      title: "Confiance",
      description: "La confidentialité et la transparence sont nos priorités",
    },
    {
      title: "Accompagnement",
      description: "Un suivi personnalisé tout au long de votre parcours",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppButton variant="floating" number={contact?.whatsappNumber} message={contact?.whatsappMsg} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-law.jpg"
            alt="Cabinet BBLAZE - Justice et Droit"
            fill
            className="object-cover opacity-25 dark:opacity-15"
            priority
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.1),transparent_50%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Votre Partenaire Juridique
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70 mt-2 animate-in fade-in duration-1000 delay-200">
                d'Excellence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
              Expertise, confiance et accompagnement personnalisé pour tous vos besoins juridiques
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-medium hover:shadow-strong text-lg px-8 hover:scale-105 transition-smooth group">
                <Link href="/contact">
                  Demander un Service
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <WhatsAppButton number={contact?.whatsappNumber} message={contact?.whatsappMsg} />
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 hover:scale-105 transition-smooth"
              >
                <a href={`mailto:${contact?.email || "contact@bblaze.fr"}`}>Nous Contacter</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-cream/30 dark:bg-navy/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.05),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-16 animate-in fade-in duration-700">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              À Propos du Cabinet
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Notre cabinet juridique accompagne entreprises et particuliers avec rigueur et expertise. 
              Nous plaçons l'excellence, la transparence et la satisfaction client au cœur de notre pratique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="border-none shadow-soft hover:shadow-strong transition-smooth hover:scale-105 bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="pt-6 text-center space-y-2">
                  <CheckCircle className="w-12 h-12 text-accent mx-auto animate-in zoom-in duration-500" />
                  <h3 className="text-xl font-serif font-bold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--accent)/0.05),transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-4 mb-16 animate-in fade-in duration-700">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Nos Domaines d'Expertise
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des solutions juridiques complètes adaptées à vos besoins spécifiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Briefcase;
              return (
                <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={IconComponent}
                    link={`/services/${service.id}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}
