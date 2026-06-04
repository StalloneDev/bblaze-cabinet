import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos - Cabinet BBLAZE",
  description: "Découvrez l'histoire, la vision et les valeurs du cabinet BBLAZE. Votre partenaire juridique de confiance.",
};

export default async function AboutPage() {
  const about = await prisma.aboutInfo.findFirst({
    where: { id: "singleton" },
  });

  const contact = await prisma.contactInfo.findFirst({
    where: { id: "singleton" },
  });

  const title = about?.title || "Notre Histoire et Notre Vision";
  const content = about?.content || "Nous sommes un cabinet dédié à l'excellence. \n\nNotre mission est de vous accompagner dans tous vos défis juridiques avec professionnalisme et rigueur.";
  const imageUrl = about?.imageUrl || "https://bblaze-cabinet-f7zk.vercel.app/hero-law.jpg";

  // Formatter le texte pour gérer les retours à la ligne
  const formattedContent = content.split('\n').map((paragraph, idx) => (
    paragraph.trim() !== "" ? (
      <p key={idx} className="mb-6 leading-relaxed text-lg text-foreground/90">
        {paragraph}
      </p>
    ) : (
      <div key={idx} className="h-4"></div>
    )
  ));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow pt-24 md:pt-32 pb-20">
        {/* Cover Image Section */}
        <section className="w-full max-w-5xl mx-auto px-4 md:px-8 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="relative w-full h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden shadow-xl border border-border">
            <img
              src={imageUrl}
              alt={title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                {title}
              </h1>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full max-w-4xl mx-auto px-4 md:px-8">
          <article className="prose prose-lg md:prose-xl max-w-none text-foreground font-sans animate-in fade-in duration-1000 delay-150">
            {formattedContent}
          </article>
        </section>

        {/* Call to Action Section */}
        <section className="w-full max-w-4xl mx-auto px-4 md:px-8 mt-20 animate-in fade-in duration-1000 delay-300">
          <div className="bg-muted p-8 md:p-12 rounded-2xl border border-border text-center shadow-soft">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Besoin de notre expertise ?</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Notre équipe est prête à vous accompagner. Contactez-nous dès aujourd'hui pour planifier une consultation ou obtenir des informations complémentaires.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/contact">
                  Nous contacter
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              {contact?.whatsappNumber && (
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-emerald-500 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700">
                  <a
                    href={`https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(contact.whatsappMsg || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discuter sur WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
