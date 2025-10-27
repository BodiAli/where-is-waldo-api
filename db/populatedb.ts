import prisma from "../prisma/prismaClient.js";
import {
  WALDO_MEDIUM,
  WALDO_EASY,
  WALDO_HARD,
  WENDA_MEDIUM,
  WENDA_HARD,
  WIZARD_MEDIUM,
  WIZARD_HARD,
} from "../types/characterTypes.js";

async function main() {
  await prisma.$transaction([
    prisma.illustration.create({
      data: {
        difficulty: "easy",
        imageSrc: "https://res.cloudinary.com/bodimahdi/image/upload/v1756318885/where-is-waldo2_f4wjsb.jpg",
        Leaderboard: { create: {} },
      },
    }),
    prisma.illustration.create({
      data: {
        difficulty: "medium",
        imageSrc: "https://res.cloudinary.com/bodimahdi/image/upload/v1756318891/where-is-waldo_t6v7zz.jpg",
        Leaderboard: { create: {} },
      },
    }),
    prisma.illustration.create({
      data: {
        difficulty: "hard",
        imageSrc: "https://res.cloudinary.com/bodimahdi/image/upload/v1756318888/where-is-waldo3_ixrwbm.jpg",
        Leaderboard: { create: {} },
      },
    }),
    prisma.character.create({
      data: {
        name: "Waldo",
        xStart: WALDO_MEDIUM.xStart,
        yStart: WALDO_MEDIUM.yStart,
        xEnd: WALDO_MEDIUM.xEnd,
        yEnd: WALDO_MEDIUM.yEnd,
        imageSrc: "https://res.cloudinary.com/bodimahdi/image/upload/v1757287738/waldo-icon_rwpwns.png",
        Illustration: {
          connect: {
            difficulty: "medium",
          },
        },
      },
    }),
    prisma.character.create({
      data: {
        name: "Wenda",
        xStart: WENDA_MEDIUM.xStart,
        yStart: WENDA_MEDIUM.yStart,
        xEnd: WENDA_MEDIUM.xEnd,
        yEnd: WENDA_MEDIUM.yEnd,
        imageSrc: "https://res.cloudinary.com/bodimahdi/image/upload/v1757287739/wenda-icon_tdlrfl.png",
        Illustration: {
          connect: {
            difficulty: "medium",
          },
        },
      },
    }),
    prisma.character.create({
      data: {
        name: "Wizard",
        xStart: WIZARD_MEDIUM.xStart,
        yStart: WIZARD_MEDIUM.yStart,
        xEnd: WIZARD_MEDIUM.xEnd,
        yEnd: WIZARD_MEDIUM.yEnd,
        imageSrc: "https://res.cloudinary.com/bodimahdi/image/upload/v1757287738/wizard-icon_yxdxkl.png",
        Illustration: {
          connect: {
            difficulty: "medium",
          },
        },
      },
    }),
    prisma.character.create({
      data: {
        name: "Waldo",
        xStart: WALDO_EASY.xStart,
        yStart: WALDO_EASY.yStart,
        xEnd: WALDO_EASY.xEnd,
        yEnd: WALDO_EASY.yEnd,
        imageSrc: "https://res.cloudinary.com/bodimahdi/image/upload/v1757287738/waldo-icon_rwpwns.png",
        Illustration: {
          connect: {
            difficulty: "easy",
          },
        },
      },
    }),
    prisma.character.create({
      data: {
        name: "Waldo",
        xStart: WALDO_HARD.xStart,
        yStart: WALDO_HARD.yStart,
        xEnd: WALDO_HARD.xEnd,
        yEnd: WALDO_HARD.yEnd,
        imageSrc: "https://res.cloudinary.com/bodimahdi/image/upload/v1757287738/waldo-icon_rwpwns.png",
        Illustration: {
          connect: {
            difficulty: "hard",
          },
        },
      },
    }),
    prisma.character.create({
      data: {
        name: "Wenda",
        xStart: WENDA_HARD.xStart,
        yStart: WENDA_HARD.yStart,
        xEnd: WENDA_HARD.xEnd,
        yEnd: WENDA_HARD.yEnd,
        imageSrc: "https://res.cloudinary.com/bodimahdi/image/upload/v1757287739/wenda-icon_tdlrfl.png",
        Illustration: {
          connect: {
            difficulty: "hard",
          },
        },
      },
    }),
    prisma.character.create({
      data: {
        name: "Wizard",
        xStart: WIZARD_HARD.xStart,
        yStart: WIZARD_HARD.yStart,
        xEnd: WIZARD_HARD.xEnd,
        yEnd: WIZARD_HARD.yEnd,
        imageSrc: "https://res.cloudinary.com/bodimahdi/image/upload/v1757287738/wizard-icon_yxdxkl.png",
        Illustration: {
          connect: {
            difficulty: "hard",
          },
        },
      },
    }),
  ]);
}

void main();
