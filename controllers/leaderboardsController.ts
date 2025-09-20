import type { Request, Response } from "express";
import prisma from "../prisma/prismaClient.js";

export async function getLeaderboards(_req: Request, res: Response) {
  const leaderboards = await prisma.leaderboard.findMany({
    include: {
      Illustration: true,
    },
  });

  res.status(200).json({ leaderboards });
}

export async function getLeaderboard(req: Request<{ leaderboardId: string }>, res: Response) {
  const { leaderboardId } = req.params;

  const leaderboard = await prisma.leaderboard.findUnique({
    where: {
      id: leaderboardId,
    },
    include: {
      User: {
        orderBy: {
          score: "asc",
        },
      },
    },
  });

  if (!leaderboard) {
    res.status(404).json({ error: "Leaderboard not found" });
    return;
  }

  res.status(200).json({ leaderboard });
}
