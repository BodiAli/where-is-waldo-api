import type { NextFunction, Request, Response } from "express";
import * as z from "zod";
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
      Characters: {
        select: {
          id: true,
          illustrationId: true,
          name: true,
          imageSrc: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!illustration) {
    res.status(404).json({ error: "Illustration not found" });
    return;
  }

  req.session.foundCharacters = [];
  req.session.startedAt = new Date();

  const charactersWithState = illustration.Characters.map((character) => {
    return { ...character, isFound: req.session.foundCharacters?.includes(character.id) };
  });

  res.json({ illustration: { ...illustration, Characters: charactersWithState } });
}

async function getCharacterAndPopulateRequest(
  req: Request<{ characterId: string; illustrationId: string }>,
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

async function areAllCharactersFound(illustrationId: string, req: Request) {
  const total = await prisma.character.count({
    where: {
      illustrationId,
    },
  });

  return total === req.session.foundCharacters?.length;
}

const Positions = z.object({
  xPosition: z.number("Please provide a valid x position."),
  yPosition: z.number("Please provide a valid y position."),
});

async function validateCharacterPosition(
  req: Request<{ illustrationId: string }, object, { xPosition: string; yPosition: string }>,
  res: Response,
  next: NextFunction
) {
  if (!req.body) {
    res.status(400).json({ error: "Please provide character positions" });
    return;
  }

  const xPosition = Number.parseInt(req.body.xPosition);
  const yPosition = Number.parseInt(req.body.yPosition);

  const result = Positions.safeParse({ xPosition, yPosition });

  if (!result.success) {
    res.status(400).json({ error: result.error.issues });
    return;
  }
  const character = req.character;

  if (
    !(
      xPosition >= character.xStart &&
      xPosition <= character.xEnd &&
      yPosition >= character.yStart &&
      yPosition <= character.yEnd
    )
  ) {
    res.status(200).json({ msg: "Try again", success: false });
    return;
  }

  if (req.session.foundCharacters?.includes(character.id)) {
    res.status(409).json({ error: `${character.name} is already found` });
    return;
  }

  req.session.foundCharacters?.push(character.id);
  console.log(req.session);

  const updatedCharacter = { ...character, isFound: true };

  if (await areAllCharactersFound(character.illustrationId, req)) {
    next();
    return;
  }

  res
    .status(200)
    .json({ character: updatedCharacter, msg: `You found ${updatedCharacter.name}`, success: true });
}

function handleGameWon(req: Request<{ illustrationId: string }>, res: Response, next: NextFunction) {
  const { startedAt } = req.session;

  if (!startedAt) {
    res.status(400).json({ error: "No active game session" });
    return;
  }

  const currentTime = new Date();

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
  });

  const startedAtDate = new Date(startedAt);

  res.status(200).json({
    msg: "Game won",
    duration: currentTime.getTime() - startedAtDate.getTime(),
  });
}

export const validate = [getCharacterAndPopulateRequest, validateCharacterPosition, handleGameWon];

export async function createLeaderboard(
  req: Request<{ illustrationId: string }, object, { name?: string; duration: number }>,
  res: Response
) {
  const { illustrationId } = req.params;
  const { name, duration } = req.body;

  if (!name) {
    res.status(400).json({ error: "Please provide a name" });
    return;
  }

  const { id: leaderboardId } = await prisma.leaderboard.update({
    data: {
      Users: {
        create: {
          name,
          score: duration,
        },
      },
    },
    where: {
      illustrationId,
    },
  });

  res.status(201).json({ leaderboardId });
}
