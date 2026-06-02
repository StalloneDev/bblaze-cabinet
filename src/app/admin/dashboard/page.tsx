import { checkAdminAuth } from "@/app/actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const revalidate = 0; // Don't cache admin page

export default async function AdminDashboardPage() {
  // 1. Vérification d'authentification côté serveur (ultra sécurisé)
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    redirect("/admin");
  }

  // 2. Précharger toutes les données de la base PostgreSQL
  const contact = await prisma.contactInfo.findFirst({
    where: { id: "singleton" },
  });

  const services = await prisma.service.findMany({
    orderBy: { title: "asc" },
  });

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          <DashboardClient
            initialContact={contact}
            initialServices={services}
            initialMessages={messages}
            initialPosts={posts}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
