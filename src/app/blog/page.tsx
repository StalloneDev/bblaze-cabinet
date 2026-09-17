import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/app/actions";
import BlogClient from "./BlogClient";



import { getImageUrl } from "@/lib/image-utils";

export default async function BlogPage() {
  let rawPosts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  let contact: Awaited<ReturnType<typeof prisma.contactInfo.findFirst>> = null;
  try {
    [rawPosts, contact] = await Promise.all([
      prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.contactInfo.findFirst({ where: { id: "singleton" } }),
    ]);
  } catch {
    // BD inaccessible — on affiche la page vide
  }

  const posts = rawPosts.map((post) => ({
    ...post,
    imageUrl: getImageUrl("post", post.id, post.imageUrl),
  }));

  const isAdmin = await checkAdminAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppButton variant="floating" number={contact?.whatsappNumber} message={contact?.whatsappMsg} />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
            <div className="space-y-4 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground">
                Publications
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Suivez nos publications, analyses juridiques et actualités du cabinet.
              </p>
            </div>
            {isAdmin && (
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-medium hover:scale-105 transition-smooth shrink-0">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Publier un Post
                </Link>
              </Button>
            )}
          </div>

          {/* Interactive blog filters and posts grid */}
          <BlogClient initialPosts={posts} isAdmin={isAdmin} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
