import { checkAdminAuth } from "@/app/actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function AdminDashboardPage() {
  // 1. Vérification d'authentification côté serveur (ultra sécurisé)
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    redirect("/admin");
  }

  // 2. Précharger toutes les données — avec fallback si la BD est inaccessible
  let contact = null;
  let services: any[] = [];
  let messages: any[] = [];
  let posts: any[] = [];
  let about = null;
  let dbError = false;

  try {
    [contact, services, messages, posts, about] = await Promise.all([
      prisma.contactInfo.findFirst({ where: { id: "singleton" } }),
      prisma.service.findMany({ orderBy: { title: "asc" } }),
      prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.aboutInfo.findFirst({ where: { id: "singleton" } }),
    ]);
  } catch (e) {
    console.error("Dashboard DB error:", e);
    dbError = true;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          {dbError && (
            <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
              <strong>⚠️ Base de données inaccessible.</strong> Les données ne peuvent pas être chargées pour le moment.
              La base de données Neon a atteint sa limite de transfert gratuit. Veuillez mettre à jour votre plan ou
              créer un nouveau projet Neon pour rétablir l&apos;accès.
            </div>
          )}
          <DashboardClient
            initialContact={contact}
            initialServices={services}
            initialMessages={messages}
            initialPosts={posts}
            initialAbout={about}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
