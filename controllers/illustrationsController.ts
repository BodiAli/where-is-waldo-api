import type { Request, Response } from "express";
import prisma from "../prisma/prismaClient.js";

export async function getIllustrations(_req: Request, res: Response) {
  const illustrations = await prisma.illustration.findMany();

  res.json({ illustrations });
}
