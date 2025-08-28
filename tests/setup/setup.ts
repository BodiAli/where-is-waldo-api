import { resetTables } from "@prisma/client/sql";
import prisma from "../../prisma/prismaClient.js";
import { afterEach } from "vitest";

afterEach(async () => {
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
