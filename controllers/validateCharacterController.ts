import type { NextFunction, Request, Response } from "express";
import prisma from "../prisma/prismaClient.js";

export const validate = [
  async (req: Request<{ characterId: string }>, res: Response, next: NextFunction) => {
    const { characterId } = req.params;

    const character = await prisma.character.findUnique({
      where: {
        id: characterId,
      },
    });

    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    req.character = character;

    next();
  },

  (req: Request<object, object, { xPosition: string; yPosition: string }>, res: Response) => {
    const xPosition = Number.parseInt(req.body.xPosition);
    const yPosition = Number.parseInt(req.body.yPosition);

    const character = req.character;

    if (
      !(
        xPosition >= character.xStart &&
        xPosition <= character.xEnd &&
        yPosition >= character.yStart &&
        yPosition <= character.yEnd
      )
    ) {
      res.sendStatus(400);
      return;
    }

    res.status(200).json({ character });
    return;
  },
];
