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
  FileText,
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
  // Charger les services, infos de contact et derniers articles de blog depuis Prisma
  const services = await prisma.service.findMany();
  const contact = await prisma.contactInfo.findFirst({
    where: { id: "singleton" },
  });
  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
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
      description: "Confidentialité et transparence absolues",
    },
    {
      title: "Accompagnement",
      description: "Suivi hautement personnalisé de A à Z",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppButton variant="floating" number={contact?.whatsappNumber} message={contact?.whatsappMsg} />

      {/* Hero Section + Blog Ticker */}
      <section className="relative pt-28 pb-16 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          {/* Balise img standard pour affichage direct garanti et instantané */}
          <img
            src="/hero-background.jpg"
            alt="Cabinet BBLAZE - Justice et Droit"
            className="w-full h-full object-cover object-center opacity-80"
          />
          {/* Overlay très léger (voile très subtil) pour préserver 100% de la visibilité de l'image de fond */}
          <div className="dark:hidden absolute inset-0 bg-gradient-to-r from-white/70 via-white/35 to-transparent pointer-events-none" />
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent pointer-events-none" />
        </div>

        <div className="container mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Hero content — centré sur mobile, aligné à gauche sur desktop */}
            <div className="lg:col-span-8 space-y-7 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-serif font-bold text-foreground leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Votre Partenaire Juridique
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70 mt-2 animate-in fade-in duration-1000 delay-200">
                  pour Sécuriser vos Activités
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
                BBLAZE Conseil accompagne les entreprises, dirigeants, investisseurs et professionnels dans la maîtrise de leurs enjeux juridiques et la sécurisation de leurs opérations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-medium hover:shadow-strong text-base px-6 hover:scale-105 transition-smooth group">
                  <Link href="/contact">
                    Demander un Service
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <WhatsAppButton number={contact?.whatsappNumber} message={contact?.whatsappMsg} />
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base px-6 hover:scale-105 transition-smooth"
                >
                  <a href={`mailto:${contact?.email || "contact@bblaze.fr"}`}>Nous Contacter</a>
                </Button>
              </div>
            </div>

            {/* Right: Vertical scrolling blog ticker — réduit pour mieux équilibrer */}
            <div className="lg:col-span-4 hidden lg:flex flex-col animate-in fade-in slide-in-from-right-8 duration-1000 delay-400">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                  Notre Blog d'Actualités
                </span>
                <Link href="/blog" className="text-xs text-muted-foreground hover:text-accent transition-colors ml-auto flex items-center gap-1">
                  Tout voir <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Ticker container */}
              <div
                className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-md overflow-hidden shadow-strong"
                style={{ height: "340px" }}
              >
                {/* Top fade */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-card/60 to-transparent z-10 pointer-events-none" />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card/60 to-transparent z-10 pointer-events-none" />

                {recentPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
                    <FileText className="w-10 h-10 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Les actualités juridiques apparaîtront ici.</p>
                  </div>
                ) : (
                  <div className="blog-ticker-track absolute top-0 left-0 right-0">
                    {/* Duplicate posts for seamless loop */}
                    {[...recentPosts, ...recentPosts, ...recentPosts].map((post, idx) => (
                      <Link
                        key={`${post.id}-${idx}`}
                        href="/blog"
                        className="group block p-4 border-b border-border/30 hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex gap-3 items-start">
                          {post.imageUrl ? (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border/40">
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-smooth"
                                sizes="64px"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center border border-border/40">
                              <FileText className="w-5 h-5 text-accent/40" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                              {post.category}
                            </span>
                            <h3 className="text-sm font-serif font-bold text-foreground line-clamp-2 mt-1 group-hover:text-accent transition-colors">
                              {post.title}
                            </h3>
                            <span className="text-[11px] text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (Nos Domaines d'Expertise) */}
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
                    imageUrl={service.imageUrl || `/services/${service.id}.png`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* À Propos du Cabinet (Version Compacte avant le Footer) */}
      <section id="about" className="py-16 bg-cream/15 dark:bg-navy/10 relative border-t border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.03),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-accent px-2.5 py-0.5 rounded-full bg-accent/10">
                Notre Cabinet
              </span>
              <h2 className="text-3xl font-serif font-bold text-foreground">
                À Propos de BBLAZE
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Notre cabinet juridique accompagne entreprises et particuliers avec rigueur et expertise. 
                Nous plaçons l'excellence, la confidentialité et l'accompagnement sur mesure au cœur de notre pratique au quotidien.
              </p>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <Card 
                  key={index} 
                  className="border-none shadow-soft bg-card/60 backdrop-blur-sm p-4 hover:border-accent/10 hover:shadow-medium transition-smooth"
                >
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-serif font-bold text-sm text-foreground">{value.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{value.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
