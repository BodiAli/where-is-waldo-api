import prisma from "../prisma/prismaClient.js";
import { WALDO_MEDIUM, WENDA_MEDIUM, WIZARD_MEDIUM } from "../types/characterTypes.js";

async function main() {
  await prisma.$transaction([
    prisma.illustration.create({
      data: {
        difficulty: "easy",
        imageSrc: "https://res.cloudinary.com/dgfglascb/image/upload/v1756318885/where-is-waldo2_f4wjsb.jpg",
        Leaderboard: { create: {} },
      },
    }),
    prisma.illustration.create({
      data: {
        difficulty: "medium",
        imageSrc: "https://res.cloudinary.com/dgfglascb/image/upload/v1756318891/where-is-waldo_t6v7zz.jpg",
        Leaderboard: { create: {} },
      },
    }),
    prisma.illustration.create({
      data: {
        difficulty: "hard",
        imageSrc: "https://res.cloudinary.com/dgfglascb/image/upload/v1756318888/where-is-waldo3_ixrwbm.jpg",
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
        imageSrc: "https://res.cloudinary.com/dgfglascb/image/upload/v1757287738/waldo-icon_rwpwns.png",
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
        imageSrc: "https://res.cloudinary.com/dgfglascb/image/upload/v1757287739/wenda-icon_tdlrfl.png",
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
        imageSrc: "https://res.cloudinary.com/dgfglascb/image/upload/v1757287738/wizard-icon_yxdxkl.png",
        Illustration: {
          connect: {
            difficulty: "medium",
          },
        },
      },
    }),
  ]);
}

void main();
