import express from "express";
import request from "supertest";
import type { Character, Illustration } from "@prisma/client";
import illustrationsRouter from "../routes/illustrationsRouter.js";
import prisma from "../prisma/prismaClient.js";

const app = express();

app.use("/illustrations", illustrationsRouter);

describe("illustrationsRouter routes", () => {
  describe("get all illustrations", () => {
    describe("given GET request to /illustrations", () => {
      it("should return 200 status and all illustrations", async () => {
        const response = await request(app).get("/illustrations").expect("Content-type", /json/).expect(200);

        const responseBody = response.body as { illustrations: Illustration[] };

        expect(responseBody.illustrations).toMatchObject([
          { difficulty: "easy" },
          { difficulty: "medium" },
          { difficulty: "hard" },
        ]);
      });
    });
  });

  describe("get a single illustration", () => {
    describe("given GET request to /illustrations/:illustrationId", async () => {
      const mediumIllustration = await prisma.illustration.findUnique({
        where: {
          difficulty: "medium",
        },
      });

      if (!mediumIllustration) {
        throw new Error("Medium illustration not found");
      }

      it("should return 200 status with the requested illustration and corresponding characters", async () => {
        const response = await request(app)
          .get(`/illustrations/${mediumIllustration.id}`)
          .expect("Content-type", /json/)
          .expect(200);

        const responseBody = response.body as { illustration: Illustration & { Characters: Character[] } };
        expect(responseBody.illustration).toMatchObject({ id: mediumIllustration.id, difficulty: "medium" });
        expect(responseBody.illustration.Characters).toMatchObject([
          { name: "Waldo" },
          { name: "Wenda" },
          { name: "Wizard" },
        ]);
      });

      it("should return 404 status with error message if illustration is not found", async () => {
        const response = await request(app)
          .get("/illustrations/invalidId")
          .expect("Content-type", /json/)
          .expect(404);

        const responseBody = response.body as { error: string };

        expect(responseBody.error).toBe("Illustration not found");
      });
    });
  });
});
