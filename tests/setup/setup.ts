import { resetTables } from "@prisma/client/sql";
import prisma from "../../prisma/prismaClient.js";
import { afterEach } from "vitest";

afterEach(async () => {
  await prisma.$queryRawTyped(resetTables());
});
