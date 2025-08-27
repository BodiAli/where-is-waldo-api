import type { NextFunction, Request, Response } from "express";
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
          isFound: true,
          name: true,
        },
      },
    },
  });

  if (!illustration) {
    res.status(404).json({ error: "Illustration not found" });
    return;
  }

  if (!req.session.gameSessionId) {
    const gameSession = await prisma.gameSession.create({
      data: {},
    });

    req.session.gameSessionId = gameSession.id;
  }

  res.json({ illustration });
}

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

async function validateCharacterPosition(
  req: Request<{ illustrationId: string }, object, { xPosition: string; yPosition: string }>,
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
    res.status(400).json({ error: "Try again" });
    return;
  }

  const updatedCharacter = await prisma.character.update({
    data: {
      isFound: true,
    },
    where: {
      id: character.id,
    },
    select: {
      id: true,
      illustrationId: true,
      isFound: true,
      name: true,
    },
  });

  if (await areAllCharactersFound(character.illustrationId)) {
    next();
    return;
  }

  res.status(200).json({ character: updatedCharacter, msg: `You found ${updatedCharacter.name}` });
  return;
}

async function handleGameWon(req: Request<{ illustrationId: string }>, res: Response, next: NextFunction) {
  const { gameSessionId } = req.session;

  if (!gameSessionId) {
    res.status(400).json({ error: "No active game session" });
    return;
  }

  const currentTime = new Date();

  const gameSession = await prisma.gameSession.update({
    where: {
      id: gameSessionId,
    },
    data: {
      endedAt: currentTime,
    },
  });

  if (!gameSession) {
    res.json(404).json({ error: "Failed to get current session" });
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
  });

  res.status(200).json({
    msg: "Game won",
    duration: gameSession.endedAt!.getTime() - gameSession.createdAt.getTime(),
    gameSessionId: gameSessionId,
  });
}

export const validate = [getCharacterAndPopulateRequest, validateCharacterPosition, handleGameWon];

export async function createLeaderboard(
  req: Request<{ illustrationId: string }, object, { name?: string; gameSessionId: string }>,
  res: Response
) {
  const { illustrationId } = req.params;
  const { name, gameSessionId } = req.body;

  if (!name) {
    res.status(400).json({ error: "Please provide a name" });
    return;
  }

  const gameSession = await prisma.gameSession.findUnique({
    where: {
      id: gameSessionId,
    },
  });

  if (!gameSession) {
    res.status(404).json({ error: "Failed to get current session" });
    return;
  }

  const duration = gameSession.endedAt!.getTime() - gameSession.createdAt.getTime();

  await prisma.leaderboard.update({
    data: {
      Score: duration,
      User: {
        create: {
          name,
        },
      },
    },
    where: {
      illustrationId,
    },
  });

  res.status(200).json({ msg: `Score created for ${name}` });
}
