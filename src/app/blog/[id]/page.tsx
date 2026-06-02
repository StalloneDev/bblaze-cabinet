import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = params;
  
  if (!id || isNaN(Number(id))) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) {
    notFound();
  }

  const contact = await prisma.contactInfo.findFirst({
    where: { id: "singleton" },
  });

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
              <div className="w-full h-64 md:h-96 relative bg-muted">
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
              <header className="space-y-4">
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
              </header>

              <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-a:text-accent hover:prose-a:text-accent/80">
                {post.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
