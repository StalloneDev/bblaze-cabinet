import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShareButtons from "@/components/ShareButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, User, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

// Fonctionalité A : Génération des balises SEO (Open Graph) pour LinkedIn, Twitter, WhatsApp
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  if (!id || isNaN(Number(id))) return {};

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) return {};

  const title = `${post.title} | BBLAZE`;
  const description = post.content.substring(0, 160) + "...";
  
  // Utiliser l'image de couverture ou une image par défaut (logo)
  const imageUrl = post.imageUrl || "https://bblaze.fr/hero-law.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://bblaze.fr/blog/${id}`,
      siteName: "Cabinet BBLAZE",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.createdAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  
  if (!id || isNaN(Number(id))) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) {
    notFound();
  }

  // Fetch 2 random related posts
  const relatedPosts = await prisma.post.findMany({
    where: { 
      NOT: { id: Number(id) },
      // On peut privilégier la même catégorie si on veut
      category: post.category
    },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  // Fallback si pas de posts dans la même catégorie
  const fallbackPosts = relatedPosts.length < 2 ? await prisma.post.findMany({
    where: { NOT: { id: Number(id) } },
    orderBy: { createdAt: "desc" },
    take: 2 - relatedPosts.length,
  }) : [];

  const finalRelatedPosts = [...relatedPosts, ...fallbackPosts].slice(0, 2);

  const contact = await prisma.contactInfo.findFirst({
    where: { id: "singleton" },
  });

  // URL canonique pour le partage
  const currentUrl = `https://bblaze.fr/blog/${post.id}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <WhatsAppButton variant="floating" number={contact?.whatsappNumber} message={contact?.whatsappMsg} />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button asChild variant="ghost" className="mb-8 hover:bg-accent/10 hover:text-accent">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux publications
            </Link>
          </Button>

          <article className="bg-card/40 backdrop-blur-sm border border-border rounded-3xl overflow-hidden shadow-soft">
            {post.imageUrl ? (
              <div className="w-full h-64 md:h-[400px] relative bg-muted">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-accent/30">
                <Calendar className="w-16 h-16" />
              </div>
            )}

            <div className="p-8 md:p-12 space-y-8">
              <header className="space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="bg-accent/10 text-accent font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    Cabinet BBLAZE
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                  {post.title}
                </h1>
                
                {/* Fonctionnalité B : Boutons de partage (Haut) */}
                <div className="pt-2 pb-4 border-b border-border/50">
                  <ShareButtons title={post.title} url={currentUrl} />
                </div>
              </header>

              <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-a:text-accent hover:prose-a:text-accent/80 text-foreground/90">
                {post.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Fonctionnalité B : Boutons de partage (Bas) */}
              <div className="pt-8 border-t border-border mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-serif font-bold text-lg">Avez-vous trouvé cet article utile ?</p>
                <ShareButtons title={post.title} url={currentUrl} />
              </div>
            </div>
          </article>

          {/* Fonctionnalité C : Articles Similaires */}
          {finalRelatedPosts.length > 0 && (
            <div className="mt-20 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold">Lire d'autres articles</h3>
                <Button asChild variant="ghost" className="text-accent hover:text-accent/80">
                  <Link href="/blog">
                    Tout voir <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {finalRelatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="flex flex-col border-border hover:border-accent/40 hover:shadow-medium transition-smooth bg-card/60 backdrop-blur-sm overflow-hidden group">
                    {relatedPost.imageUrl && (
                      <div className="h-40 w-full overflow-hidden">
                        <img 
                          src={relatedPost.imageUrl} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                        />
                      </div>
                    )}
                    <CardHeader className="p-5 pb-3">
                      <div className="text-xs text-accent font-semibold mb-2 uppercase tracking-wider">
                        {relatedPost.category}
                      </div>
                      <CardTitle className="text-xl font-serif line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                        {relatedPost.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 mt-auto">
                      <Button asChild variant="link" className="p-0 text-foreground group-hover:text-accent h-auto">
                        <Link href={`/blog/${relatedPost.id}`}>
                          Lire la suite <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
