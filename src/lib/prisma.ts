import { PrismaClient } from '@prisma/client';
import { cache } from 'react';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helpers avec cache React pour dédupliquer les requêtes côté serveur
export const getContactInfo = cache(async () => {
  return prisma.contactInfo.findFirst({ where: { id: 'singleton' } });
});

export const getServices = cache(async () => {
  return prisma.service.findMany({ orderBy: { title: 'asc' } });
});

export const getPosts = cache(async () => {
  return prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
});
