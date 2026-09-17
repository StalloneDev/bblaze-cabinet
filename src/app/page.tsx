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
  ArrowRight,
  FileText,
  Search,
  Box,
  ShieldCheck,
  Award,
  Eye,
  Lock,
  Target,
  MessageSquareText
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/image-utils";
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

export default async function IndexPage() {
  let services: any[] = [];
  let contact: Awaited<ReturnType<typeof prisma.contactInfo.findFirst>> = null;
  let recentPosts: any[] = [];

  try {
    [services, contact, recentPosts] = await Promise.all([
      prisma.service.findMany({
        select: { id: true, title: true, description: true, icon: true, imageUrl: true },
      }),
      prisma.contactInfo.findFirst({ where: { id: "singleton" } }),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { id: true, title: true, category: true, createdAt: true, imageUrl: true },
      }),
    ]);
  } catch {
    // BD inaccessible — on affiche la page avec les valeurs par défaut
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppButton variant="floating" number={contact?.whatsappNumber} message={contact?.whatsappMsg} />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden flex items-center justify-center min-h-[65vh]">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-background.jpg"
            alt="Cabinet BBLAZE - Justice et Droit"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="dark:hidden absolute inset-0 bg-gradient-to-t from-background via-white/50 to-transparent pointer-events-none" />
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-background via-slate-950/60 to-transparent pointer-events-none" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
            Sécurisons vos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70 ml-2">
              activités économiques et commerciales
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Bblaze accompagne les entreprises, dirigeants et investisseurs dans la sécurisation juridique de leurs décisions, contrats et opérations dans l'espace OHADA.
          </p>
          <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
             <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-medium hover:shadow-strong text-base md:text-lg px-8 py-5 rounded-full hover:scale-105 transition-smooth group">
               <a href={`https://wa.me/${contact?.whatsappNumber?.replace(/[\s+]+/g, '') || "22900000000"}?text=${encodeURIComponent("Bonjour, je souhaite parler à un conseil.")}`} target="_blank" rel="noopener noreferrer">
                 Parler à un conseil
                 <MessageSquareText className="ml-2 w-5 h-5" />
               </a>
             </Button>
          </div>
        </div>
      </section>

      {/* Section Notre Promesse */}
      <section className="py-12 md:py-14 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Notre Promesse</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-3 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Analyser */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-accent/40 hover:shadow-strong transition-smooth group overflow-hidden">
              <CardContent className="p-6 md:p-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-accent/20 transition-smooth">
                  <Search className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">Analyser</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Comprendre en profondeur votre situation et identifier les risques juridiques potentiels.</p>
              </CardContent>
            </Card>

            {/* Structurer */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-accent/40 hover:shadow-strong transition-smooth group overflow-hidden">
              <CardContent className="p-6 md:p-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-accent/20 transition-smooth">
                  <Box className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">Structurer</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Mettre en place des cadres juridiques solides et adaptés à vos ambitions de croissance.</p>
              </CardContent>
            </Card>

            {/* Sécuriser */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-accent/40 hover:shadow-strong transition-smooth group overflow-hidden">
              <CardContent className="p-6 md:p-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-accent/20 transition-smooth">
                  <ShieldCheck className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">Sécuriser</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Protéger vos intérêts, vos actifs et vos décisions face aux aléas de l'environnement économique.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section (Nos Domaines d'Expertise) */}
      <section id="services" className="py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--accent)/0.05),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-3 mb-10 animate-in fade-in duration-700">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Nos Expertises
            </h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-3 rounded-full"></div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mt-3">
              Des solutions juridiques complètes adaptées à vos besoins spécifiques dans l'espace OHADA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Briefcase;
              return (
                <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={IconComponent}
                    link={`/services/${service.id}`}
                    imageUrl={getImageUrl("service", service.id, service.imageUrl)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pourquoi BBLAZE ? */}
      <section className="py-12 md:py-14 bg-accent/5 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Pourquoi BBLAZE ?</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Expertise */}
            <div className="bg-background rounded-2xl p-6 shadow-soft border border-border hover:border-accent/30 transition-smooth group">
              <Award className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">Expertise</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Une maîtrise pointue du droit des affaires et de l'environnement OHADA pour des solutions sur-mesure.</p>
            </div>
            
            {/* Anticipation */}
            <div className="bg-background rounded-2xl p-6 shadow-soft border border-border hover:border-accent/30 transition-smooth group">
              <Eye className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">Anticipation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Nous identifions les risques avant qu'ils ne se matérialisent pour protéger proactivement vos intérêts.</p>
            </div>

            {/* Confidentialité */}
            <div className="bg-background rounded-2xl p-6 shadow-soft border border-border hover:border-accent/30 transition-smooth group">
              <Lock className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">Confidentialité</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Le secret professionnel et la discrétion absolue sont les fondements de notre relation de confiance.</p>
            </div>

            {/* Pragmatisme */}
            <div className="bg-background rounded-2xl p-6 shadow-soft border border-border hover:border-accent/30 transition-smooth group">
              <Target className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">Pragmatisme</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Des conseils pratiques et opérationnels, directement applicables à la réalité de votre entreprise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Approche */}
      <section className="py-12 md:py-14 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Notre Approche</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="relative">
            {/* Ligne de connexion */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
              {[
                { step: "01", title: "Comprendre", desc: "Écoute active de vos enjeux" },
                { step: "02", title: "Analyser", desc: "Étude approfondie du dossier" },
                { step: "03", title: "Conseiller", desc: "Recommandations stratégiques" },
                { step: "04", title: "Sécuriser", desc: "Mise en œuvre des solutions" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-14 h-14 rounded-full bg-background border-2 border-accent text-accent flex items-center justify-center text-lg font-bold mb-4 shadow-medium group-hover:bg-accent group-hover:text-accent-foreground transition-colors z-10 relative">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications (Carrousel Horizontal) */}
      <section className="py-12 md:py-14 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4 mb-8 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Publications</h2>
          <div className="w-16 h-1 bg-accent mt-3 rounded-full"></div>
          <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-xl">
            Découvrez nos dernières analyses juridiques et publications d'actualité.
          </p>
        </div>

        {recentPosts.length > 0 ? (
          <div className="relative w-full flex overflow-x-hidden group">
            <div className="animate-marquee flex gap-6 px-4 py-3 whitespace-nowrap group-hover:[animation-play-state:paused]">
              {[...recentPosts, ...recentPosts, ...recentPosts].map((post, idx) => (
                <Link key={`${post.id}-${idx}`} href={`/blog/${post.id}`} className="w-[300px] md:w-[360px] flex-shrink-0 group/card">
                  <Card className="h-full bg-background border-border hover:border-accent/40 shadow-soft hover:shadow-medium transition-smooth overflow-hidden flex flex-col">
                    {post.imageUrl ? (
                      <div className="w-full h-44 relative overflow-hidden">
                        <Image src={getImageUrl("post", post.id, post.imageUrl)} alt={post.title} fill className="object-cover group-hover/card:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 360px" />
                      </div>
                    ) : (
                      <div className="w-full h-44 bg-muted flex items-center justify-center">
                        <FileText className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                    <CardContent className="p-5 whitespace-normal flex-1 flex flex-col">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-accent mb-2 inline-block">
                        {post.category}
                      </span>
                      <h3 className="text-base font-serif font-bold line-clamp-2 mb-3 group-hover/card:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <div className="mt-auto flex justify-between items-center text-xs text-muted-foreground pt-3 border-t border-border/50">
                        <span>{new Date(post.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="flex items-center text-accent group-hover/card:translate-x-1 transition-transform font-medium">Lire <ArrowRight className="ml-1 w-3.5 h-3.5" /></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 text-center py-8">
            <p className="text-muted-foreground">Aucune publication pour le moment.</p>
          </div>
        )}
        <div className="container mx-auto px-4 mt-6 flex justify-center">
          <Button asChild variant="outline" className="rounded-full px-6 text-sm">
            <Link href="/blog">Voir toutes les publications <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 md:py-16 px-4 container mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-12 text-center text-white shadow-strong border border-primary/20 dark:bg-primary/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white">
              Votre entreprise est confrontée à une question juridique ?
            </h2>
            <p className="text-base md:text-lg opacity-90 font-medium text-white/90">
              Échangeons sur votre situation.
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm md:text-base px-8 py-5 rounded-full shadow-medium hover:scale-105 transition-transform font-bold">
                <Link href="/contact">
                  Contacter BBLAZE
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
