"use server";

import { revalidatePath } from "next/cache";
import { auth, prisma } from "@/lib/auth";
import type { MovieStatus } from "@prisma/client";

export type ToggleResult =
  | { success: true; action: "added" | "removed" }
  | { success: false; error: string };

/**
 * Ajoute ou retire un film d'une liste de l'utilisateur connecté.
 * Si déjà présent avec ce status → retire. Sinon → ajoute.
 */
export async function toggleMovieInList(
  movieId: number,
  status: MovieStatus
): Promise<ToggleResult> {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: "Vous devez etre connecte." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "Utilisateur introuvable." };
    }

    const existing = await prisma.userMovie.findUnique({
      where: {
        userId_movieId_status: {
          userId: user.id,
          movieId,
          status,
        },
      },
    });

    if (existing) {
      await prisma.userMovie.delete({
        where: { id: existing.id },
      });
      revalidatePath(`/movie/${movieId}`);
      revalidatePath("/lists");
      return { success: true, action: "removed" };
    } else {
      await prisma.userMovie.create({
        data: {
          userId: user.id,
          movieId,
          status,
        },
      });
      revalidatePath(`/movie/${movieId}`);
      revalidatePath("/lists");
      return { success: true, action: "added" };
    }
  } catch (error) {
    console.error("toggleMovieInList error:", error);
    return { success: false, error: "Erreur serveur." };
  }
}

/**
 * Récupère le statut d'un film pour l'utilisateur connecté.
 * Renvoie tous les status présents (un film peut être Favori ET Vu).
 */
export async function getMovieStatusForUser(
  movieId: number
): Promise<MovieStatus[]> {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return [];

  const entries = await prisma.userMovie.findMany({
    where: {
      userId: user.id,
      movieId,
    },
    select: { status: true },
  });

  return entries.map((e) => e.status);
}

/**
 * Récupère tous les films d'un statut donné pour l'utilisateur connecté.
 */
export async function getUserMoviesByStatus(
  status: MovieStatus
): Promise<number[]> {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return [];

  const entries = await prisma.userMovie.findMany({
    where: {
      userId: user.id,
      status,
    },
    orderBy: { addedAt: "desc" },
    select: { movieId: true },
  });

  return entries.map((e) => e.movieId);
}
