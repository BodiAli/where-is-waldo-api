import type { Request, Response } from "express";
import prisma from "../prisma/prismaClient.js";

export async function getIllustrations(_req: Request, res: Response) {
  const illustrations = await prisma.illustration.findMany();

  res.json({ illustrations });
}

export async function getIllustration(req: Request<{ illustrationId: string }>, res: Response) {
  const { illustrationId } = req.params;

  const illustration = await prisma.illustration.findUnique({
    where: {
      id: illustrationId,
    },
    include: {
      Characters: true,
    },
  });

  if (!illustration) {
    res.status(404).json({ error: "Illustration not found" });
    return;
  }

  res.json({ illustration });
}
