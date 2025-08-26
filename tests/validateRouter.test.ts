import express from "express";
import request from "supertest";
import type { Character } from "@prisma/client";
import validateCharacterRouter from "../routes/validateCharacterRouter.js";
import prisma from "../prisma/prismaClient.js";
import { WALDO_MEDIUM } from "../types/characterTypes.js";

const app = express();

app.use(express.json());
app.use("/validate", validateCharacterRouter);

describe("validateCharacterRouter routes", () => {
  describe("validate character position", async () => {
    const waldo = await prisma.character.findFirst({
      where: {
        name: "waldo",
        Illustration: {
          difficulty: "medium",
        },
      },
    });

    if (!waldo) {
      throw new Error("Character: Waldo is not found");
    }

    describe("given valid character position", () => {
      it("should return 200 status code and mark character as found and send a success message", async () => {
        const response = await request(app)
          .post(`/validate/${waldo.id}`)
          .type("json")
          .send({ xPosition: WALDO_MEDIUM.xStart, yPosition: WALDO_MEDIUM.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        const responseBody = response.body as { character: Character };

        expect(responseBody.character).toEqual(waldo);
      });
    });

    describe("given invalid character position", () => {
      it("should return 400 status code", async () => {
        await request(app)
          .post(`/validate/${waldo.id}`)
          .type("json")
          .send({ xPosition: 200, yPosition: 300 })
          .expect(400);
      });
    });
  });
});
