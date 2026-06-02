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

      {/* Publications Récentes du Blog (Remplaçant l'ancienne section À Propos) */}
      <section className="py-20 bg-cream/30 dark:bg-navy/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.05),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 animate-in fade-in duration-700">
            <span className="text-xs font-bold uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10">
              Notre Blog d'Actualités
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Dernières Analyses & Actualités
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Décryptage de l'actualité juridique et conseils pratiques rédigés par nos experts pour sécuriser vos activités.
            </p>
          </div>

          {recentPosts.length === 0 ? (
            <Card className="text-center py-12 border-border shadow-soft bg-card/40 backdrop-blur-sm max-w-lg mx-auto">
              <CardContent className="space-y-3 pt-6">
                <FileText className="w-10 h-10 text-muted-foreground/35 mx-auto" />
                <h3 className="text-lg font-serif font-bold">Aucun article publié</h3>
                <p className="text-muted-foreground text-sm">
                  Les publications d'actualités et d'analyses juridiques apparaîtront bientôt ici.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="group hover:shadow-strong transition-smooth border-border hover:border-accent/40 bg-card/80 backdrop-blur-sm flex flex-col justify-between overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Bannière de couverture */}
                    <div className="h-48 w-full relative overflow-hidden bg-muted">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-smooth"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-accent/30">
                          <FileText className="w-10 h-10" />
                        </div>
                      )}
                      
                      {/* Badge catégorie */}
                      <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-accent text-accent-foreground shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    <div className="px-6 space-y-2">
                      <span className="text-xs text-muted-foreground block">
                        {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                      <h3 className="text-lg font-serif font-bold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  <CardContent className="pt-4 px-6 pb-6 mt-4">
                    <Button asChild variant="ghost" className="group/btn w-full justify-between hover:bg-accent/5 hover:text-accent border border-transparent hover:border-accent/20 rounded-lg text-xs py-4">
                      <Link href="/blog">
                        <span className="font-semibold">Lire l'article</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-smooth" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-medium text-base px-8 transition-smooth">
              <Link href="/blog">
                Découvrir tout le blog
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
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
                    imageUrl={`/services/${service.id}.png`}
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
