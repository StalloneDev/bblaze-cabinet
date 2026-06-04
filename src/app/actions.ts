"use server";

import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { sendContactNotificationEmail } from "@/lib/mail";
import { z } from "zod";

// Limiteur de débit en mémoire (IP -> timestamp du dernier envoi)
const ipRateLimits = new Map<string, number>();

// Schéma de validation des messages de contact
const ContactMessageSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(100, "Le nom ne doit pas dépasser 100 caractères."),
  email: z.string().trim().email("Adresse e-mail invalide.").max(255),
  phone: z.string().trim().max(30, "Le numéro de téléphone ne doit pas dépasser 30 caractères.").optional().nullable(),
  subject: z.string().trim().min(2, "Le sujet doit contenir au moins 2 caractères.").max(150, "Le sujet ne doit pas dépasser 150 caractères."),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères.").max(1000, "Le message ne doit pas dépasser 1000 caractères."),
});

// 1. Authentification Admin
export async function loginAdminAction(password: string): Promise<{ success: boolean; error?: string }> {
  const envPassword = process.env.ADMIN_PASSWORD || "Cabinet2026!";
  if (password === envPassword) {
    const cookieStore = await cookies();
    cookieStore.set("cabinet_admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Mot de passe incorrect" };
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete("cabinet_admin_session");
  return { success: true };
}

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("cabinet_admin_session");
  return session?.value === "true";
}

// 2. Gestion du Contact
export async function updateContactAction(data: {
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  whatsappMsg: string;
}): Promise<{ success: boolean; error?: string }> {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return { success: false, error: "Non autorisé" };

  try {
    await prisma.contactInfo.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
    revalidatePath("/");
    revalidatePath("/contact");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la mise à jour des coordonnées" };
  }
}

// 3. Gestion des Services
export async function updateServiceAction(
  id: string,
  data: {
    title: string;
    description: string;
    expertise: string[];
    bulletPoints: string[];
    icon: string;
    imageBase64?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return { success: false, error: "Non autorisé" };

  try {
    const content = JSON.stringify({
      expertise: data.expertise,
      bulletPoints: data.bulletPoints,
    });

    const updateData: any = {
      title: data.title,
      description: data.description,
      content,
      icon: data.icon,
    };
    
    if (data.imageBase64 !== undefined) {
      updateData.imageUrl = data.imageBase64;
    }

    await prisma.service.update({
      where: { id },
      data: updateData,
    });
    revalidatePath("/");
    revalidatePath(`/services/${id}`);
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la mise à jour du service" };
  }
}

// 3.5 Gestion de la page À Propos
export async function updateAboutAction(data: {
  title: string;
  content: string;
  imageBase64?: string;
}): Promise<{ success: boolean; error?: string }> {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return { success: false, error: "Non autorisé" };

  try {
    const updateData: any = {
      title: data.title,
      content: data.content,
    };

    if (data.imageBase64 !== undefined) {
      updateData.imageUrl = data.imageBase64;
    }

    await prisma.aboutInfo.upsert({
      where: { id: "singleton" },
      update: updateData,
      create: {
        id: "singleton",
        title: data.title,
        content: data.content,
        imageUrl: data.imageBase64 || null,
      },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la mise à jour de la page À propos" };
  }
}

// 4. Gestion du Blog (Articles / Posts)
export async function createPostAction(data: {
  title: string;
  content: string;
  category?: string;
  imageBase64?: string;
}): Promise<{ success: boolean; error?: string }> {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return { success: false, error: "Non autorisé" };

  if (!data.title.trim() || !data.content.trim()) {
    return { success: false, error: "Le titre et le contenu sont obligatoires." };
  }

  try {
    await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageBase64 || null,
        category: data.category || "Actu",
      },
    });
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la création de l'article" };
  }
}

export async function deletePostAction(id: number): Promise<{ success: boolean; error?: string }> {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return { success: false, error: "Non autorisé" };

  try {
    await prisma.post.delete({
      where: { id },
    });
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la suppression de l'article" };
  }
}

// 5. Gestion des Messages Clients (Amélioration !)
export async function submitContactMessageAction(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  // 1. Validation côté serveur via Zod
  const validation = ContactMessageSchema.safeParse(data);
  if (!validation.success) {
    const errorMsg = validation.error.errors[0]?.message || "Données invalides.";
    return { success: false, error: errorMsg };
  }

  const cleanData = validation.data;

  // 2. Protection Anti-Spam / Rate Limiting par IP
  try {
    const headerList = await headers();
    const clientIp = headerList.get("x-forwarded-for")?.split(",")[0] || 
                     headerList.get("x-real-ip") || 
                     "127.0.0.1";
                     
    const now = Date.now();
    const lastSubmission = ipRateLimits.get(clientIp);
    
    if (lastSubmission && now - lastSubmission < 60 * 1000) {
      const waitSeconds = Math.ceil((60 * 1000 - (now - lastSubmission)) / 1000);
      return { 
        success: false, 
        error: `Trop de messages envoyés. Veuillez patienter ${waitSeconds} secondes avant de réessayer.` 
      };
    }
    
    ipRateLimits.set(clientIp, now);
  } catch (ipErr) {
    console.error("Impossible de récupérer l'IP du client :", ipErr);
  }

  // 3. Enregistrement en base de données
  try {
    const newMessage = await prisma.message.create({
      data: {
        name: cleanData.name,
        email: cleanData.email,
        phone: cleanData.phone || null,
        subject: cleanData.subject,
        message: cleanData.message,
        read: false,
      },
    });
    
    // Envoi de la notification par email (non bloquant en cas d'erreur de mail)
    try {
      await sendContactNotificationEmail({
        name: newMessage.name,
        email: newMessage.email,
        phone: newMessage.phone,
        subject: newMessage.subject,
        message: newMessage.message,
      });
    } catch (mailErr) {
      console.error("Erreur non bloquante d'envoi de notification email :", mailErr);
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur d'enregistrement du message client :", error);
    return { 
      success: false, 
      error: "Une erreur technique est survenue sur notre serveur. Veuillez réessayer plus tard." 
    };
  }
}

export async function toggleMessageReadAction(id: number, read: boolean): Promise<{ success: boolean; error?: string }> {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return { success: false, error: "Non autorisé" };

  try {
    await prisma.message.update({
      where: { id },
      data: { read },
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la modification du statut" };
  }
}

export async function deleteContactMessageAction(id: number): Promise<{ success: boolean; error?: string }> {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return { success: false, error: "Non autorisé" };

  try {
    await prisma.message.delete({
      where: { id },
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la suppression du message" };
  }
}
