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
  const services = await prisma.service.findMany();
  const contact = await prisma.contactInfo.findFirst({
    where: { id: "singleton" },
  });
  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppButton variant="floating" number={contact?.whatsappNumber} message={contact?.whatsappMsg} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden flex items-center justify-center min-h-[75vh]">
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-foreground leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
            Droit des affaires et sécurisation juridique des
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70 ml-2">
              activités économiques
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Bblaze accompagne les entreprises, dirigeants et investisseurs dans la sécurisation de leurs décisions, contrats et opérations dans l'espace OHADA.
          </p>
          <div className="mt-10 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
             <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-medium hover:shadow-strong text-lg px-8 py-6 rounded-full hover:scale-105 transition-smooth group">
               <a href={`https://wa.me/${contact?.whatsappNumber?.replace(/[\s+]+/g, '') || "22900000000"}?text=${encodeURIComponent("Bonjour, je souhaite parler à un conseil.")}`} target="_blank" rel="noopener noreferrer">
                 Parler à un conseil
                 <MessageSquareText className="ml-2 w-5 h-5" />
               </a>
             </Button>
          </div>
        </div>
      </section>

      {/* Section Notre Promesse */}
      <section className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Notre Promesse</h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Analyser */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-accent/40 hover:shadow-strong transition-smooth group overflow-hidden">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/20 transition-smooth">
                  <Search className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">Analyser</h3>
                <p className="text-muted-foreground">Comprendre en profondeur votre situation et identifier les risques juridiques potentiels.</p>
              </CardContent>
            </Card>

            {/* Structurer */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-accent/40 hover:shadow-strong transition-smooth group overflow-hidden">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/20 transition-smooth">
                  <Box className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">Structurer</h3>
                <p className="text-muted-foreground">Mettre en place des cadres juridiques solides et adaptés à vos ambitions de croissance.</p>
              </CardContent>
            </Card>

            {/* Sécuriser */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-accent/40 hover:shadow-strong transition-smooth group overflow-hidden">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/20 transition-smooth">
                  <ShieldCheck className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">Sécuriser</h3>
                <p className="text-muted-foreground">Protéger vos intérêts, vos actifs et vos décisions face aux aléas de l'environnement économique.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section (Nos Domaines d'Expertise) */}
      <section id="services" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--accent)/0.05),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-4 mb-16 animate-in fade-in duration-700">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Nos Expertises
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
              Des solutions juridiques complètes adaptées à vos besoins spécifiques dans l'espace OHADA
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

      {/* Pourquoi BBLAZE ? */}
      <section className="py-24 bg-accent/5 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Pourquoi BBLAZE ?</h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Expertise */}
            <div className="bg-background rounded-2xl p-8 shadow-soft border border-border hover:border-accent/30 transition-smooth group">
              <Award className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">Expertise</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Une maîtrise pointue du droit des affaires et de l'environnement OHADA pour des solutions sur-mesure.</p>
            </div>
            
            {/* Anticipation */}
            <div className="bg-background rounded-2xl p-8 shadow-soft border border-border hover:border-accent/30 transition-smooth group">
              <Eye className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">Anticipation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Nous identifions les risques avant qu'ils ne se matérialisent pour protéger proactivement vos intérêts.</p>
            </div>

            {/* Confidentialité */}
            <div className="bg-background rounded-2xl p-8 shadow-soft border border-border hover:border-accent/30 transition-smooth group">
              <Lock className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">Confidentialité</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Le secret professionnel et la discrétion absolue sont les fondements de notre relation de confiance.</p>
            </div>

            {/* Pragmatisme */}
            <div className="bg-background rounded-2xl p-8 shadow-soft border border-border hover:border-accent/30 transition-smooth group">
              <Target className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">Pragmatisme</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Des conseils pratiques et opérationnels, directement applicables à la réalité de votre entreprise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Approche */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Notre Approche</h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="relative">
            {/* Ligne de connexion */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
              {[
                { step: "01", title: "Comprendre", desc: "Écoute active de vos enjeux" },
                { step: "02", title: "Analyser", desc: "Étude approfondie du dossier" },
                { step: "03", title: "Conseiller", desc: "Recommandations stratégiques" },
                { step: "04", title: "Sécuriser", desc: "Mise en œuvre des solutions" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full bg-background border-2 border-accent text-accent flex items-center justify-center text-xl font-bold mb-6 shadow-medium group-hover:bg-accent group-hover:text-accent-foreground transition-colors z-10 relative">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications (Carrousel Horizontal) */}
      <section className="py-24 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Publications</h2>
              <div className="w-20 h-1 bg-accent mt-6 rounded-full"></div>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex hover:text-accent">
              <Link href="/blog">Voir tout <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>

        {recentPosts.length > 0 ? (
          <div className="relative w-full flex overflow-x-hidden group">
            <div className="animate-marquee flex gap-6 px-4 py-4 whitespace-nowrap group-hover:[animation-play-state:paused]">
              {[...recentPosts, ...recentPosts, ...recentPosts].map((post, idx) => (
                <Link key={`${post.id}-${idx}`} href={`/blog/${post.id}`} className="w-[320px] md:w-[400px] flex-shrink-0 group/card">
                  <Card className="h-full bg-background border-border hover:border-accent/40 shadow-soft hover:shadow-medium transition-smooth overflow-hidden flex flex-col">
                    {post.imageUrl ? (
                      <div className="w-full h-48 relative overflow-hidden">
                        <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover/card:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 400px" />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <FileText className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <CardContent className="p-6 whitespace-normal flex-1 flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent mb-3 inline-block">
                        {post.category}
                      </span>
                      <h3 className="text-lg font-serif font-bold line-clamp-2 mb-3 group-hover/card:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <div className="mt-auto flex justify-between items-center text-sm text-muted-foreground pt-4 border-t border-border/50">
                        <span>{new Date(post.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="flex items-center text-accent group-hover/card:translate-x-1 transition-transform">Lire <ArrowRight className="ml-1 w-4 h-4" /></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 text-center py-12">
            <p className="text-muted-foreground">Aucune publication pour le moment.</p>
          </div>
        )}
        <div className="container mx-auto px-4 mt-8 sm:hidden flex justify-center">
          <Button asChild variant="outline" className="w-full">
            <Link href="/blog">Voir toutes les publications</Link>
          </Button>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center text-accent-foreground">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 max-w-3xl mx-auto">
            Votre entreprise est confrontée à une question juridique ?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Échangeons sur votre situation.
          </p>
          <Button asChild size="lg" className="bg-background text-accent hover:bg-background/90 text-lg px-10 py-6 rounded-full shadow-strong hover:scale-105 transition-transform">
            <Link href="/contact">
              Contacter BBLAZE
            </Link>
          </Button>
        </div>
      </section>

      <Footer contact={contact} />
    </div>
  );
}
