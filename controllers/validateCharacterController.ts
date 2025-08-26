import type { NextFunction, Request, Response } from "express";
import prisma from "../prisma/prismaClient.js";

async function areAllCharactersFound(illustrationId: string) {
  const [total, found] = await Promise.all([
    prisma.character.count({
      where: {
        illustrationId,
      },
    }),
    prisma.character.count({
      where: {
        illustrationId,
        isFound: true,
      },
    }),
  ]);

  return total === found;
}

async function getCharacterAndPopulateRequest(
  req: Request<{ characterId: string }>,
  res: Response,
  next: NextFunction
) {
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
}

async function validateCharacterPosition(
  req: Request<object, object, { xPosition: string; yPosition: string }>,
  res: Response,
  next: NextFunction
) {
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

  const updatedCharacter = await prisma.character.update({
    data: {
      isFound: true,
    },
    where: {
      id: character.id,
    },
  });

  if (await areAllCharactersFound(character.illustrationId)) {
    next();
    return;
  }

  res.status(200).json({ character: updatedCharacter, msg: `You found ${updatedCharacter.name}` });
  return;
}

function handleGameWon(req: Request, res: Response) {
  res.status(200).json({
    msg: "Game won",
  });
}

export const validate = [getCharacterAndPopulateRequest, validateCharacterPosition, handleGameWon];
