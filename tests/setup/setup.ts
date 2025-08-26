import { resetTables } from "@prisma/client/sql";
import prisma from "../../prisma/prismaClient.js";
import { afterAll } from "vitest";

afterAll(async () => {
  await prisma.$queryRawTyped(resetTables());
  await prisma.character.updateMany({
    where: {
      isFound: true,
    },
    data: {
      isFound: false,
    },
  });
});
