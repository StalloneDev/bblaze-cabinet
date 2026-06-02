import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bblaze-cabinet-f7zk.vercel.app";

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  // Pages de services (dynamiques depuis la BDD)
  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const services = await prisma.service.findMany({ select: { id: true } });
    servicePages = services.map((s) => ({
      url: `${baseUrl}/services/${s.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // En cas d'erreur DB, on continue sans les services
  }

  return [...staticPages, ...servicePages];
}
