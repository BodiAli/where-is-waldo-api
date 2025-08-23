import prisma from "../prisma/prismaClient.js";

const WALDO_MEDIUM = { xStart: 856, xEnd: 912, yStart: 922, yEnd: 1028 } as const;
const WENDA_MEDIUM = { xStart: 875, xEnd: 901, yStart: 741, yEnd: 792 } as const;
const WIZARD_MEDIUM = { xStart: 1325, xEnd: 1374, yStart: 964, yEnd: 997 } as const;

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
      name: "waldo",
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
      name: "wenda",
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
      name: "wizard",
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
