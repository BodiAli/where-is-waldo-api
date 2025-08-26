import prisma from "../prisma/prismaClient.js";
import { WALDO_MEDIUM, WENDA_MEDIUM, WIZARD_MEDIUM } from "../types/characterTypes.js";

async function main() {
  await prisma.illustration.createMany({
    data: [
      {
        difficulty: "easy",
      },
      {
        difficulty: "medium",
      },
      {
        difficulty: "hard",
      },
    ],
  });
  await prisma.leaderboard.create({
    data: {
      Illustration: {
        connect: {
          difficulty: "medium",
        },
      },
    },
  });
  await prisma.character.create({
    data: {
      name: "Waldo",
      xStart: WALDO_MEDIUM.xStart,
      yStart: WALDO_MEDIUM.yStart,
      xEnd: WALDO_MEDIUM.xEnd,
      yEnd: WALDO_MEDIUM.yEnd,
      Illustration: {
        connect: {
          difficulty: "medium",
        },
      },
    },
  });
  await prisma.character.create({
    data: {
      name: "Wenda",
      xStart: WENDA_MEDIUM.xStart,
      yStart: WENDA_MEDIUM.yStart,
      xEnd: WENDA_MEDIUM.xEnd,
      yEnd: WENDA_MEDIUM.yEnd,
      Illustration: {
        connect: {
          difficulty: "medium",
        },
      },
    },
  });
  await prisma.character.create({
    data: {
      name: "Wizard",
      xStart: WIZARD_MEDIUM.xStart,
      yStart: WIZARD_MEDIUM.yStart,
      xEnd: WIZARD_MEDIUM.xEnd,
      yEnd: WIZARD_MEDIUM.yEnd,
      Illustration: {
        connect: {
          difficulty: "medium",
        },
      },
    },
  });
}

void main();
