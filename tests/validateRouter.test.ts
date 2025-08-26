import express from "express";
import request from "supertest";
import type { Character } from "@prisma/client";
import validateCharacterRouter from "../routes/validateCharacterRouter.js";
import prisma from "../prisma/prismaClient.js";
import { WALDO_MEDIUM, WIZARD_MEDIUM } from "../types/characterTypes.js";

const app = express();

app.use(express.json());
app.use("/validate", validateCharacterRouter);

describe("validateCharacterRouter routes", () => {
  describe("validate character position", () => {
    describe("given valid character position", () => {
      it("should return 200 status code and mark character as found and send a success message", async () => {
        const waldo = await prisma.character.findFirst({
          where: {
            name: "Waldo",
            Illustration: {
              difficulty: "medium",
            },
          },
        });

        if (!waldo) {
          throw new Error("Waldo is not found");
        }

        const response = await request(app)
          .post(`/validate/${waldo.id}`)
          .type("json")
          .send({ xPosition: WALDO_MEDIUM.xStart, yPosition: WALDO_MEDIUM.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        const responseBody = response.body as { character: Character; msg: string };

        const updatedWaldo = await prisma.character.findUnique({
          where: { id: waldo.id },
        });

        if (!updatedWaldo) {
          throw new Error("Waldo is not found");
        }

        expect(updatedWaldo.isFound).toBe(true);
        expect(responseBody.character).toEqual({ ...updatedWaldo });
        expect(responseBody.msg).toBe("You found Waldo");
      });
    });

    describe("given invalid character position", () => {
      it("should return 400 status code", async () => {
        const waldo = await prisma.character.findFirst({
          where: {
            name: "Waldo",
            Illustration: {
              difficulty: "medium",
            },
          },
        });

        if (!waldo) {
          throw new Error("Waldo is not found");
        }

        await request(app)
          .post(`/validate/${waldo.id}`)
          .type("json")
          .send({ xPosition: 200, yPosition: 300 })
          .expect(400);
      });
    });

    describe("given last character is found", () => {
      it("should return 200 status with Game won message when all characters are found", async () => {
        await prisma.character.updateManyAndReturn({
          data: {
            isFound: true,
          },
          where: {
            name: "Wenda",
            Illustration: {
              difficulty: "medium",
            },
          },
        });

        const wizard = await prisma.character.findFirst({
          where: {
            name: "Wizard",
            Illustration: {
              difficulty: "medium",
            },
          },
        });

        if (!wizard) {
          throw new Error("Wizard is not found");
        }

        const response = await request(app)
          .post(`/validate/${wizard.id}`)
          .type("json")
          .send({ xPosition: WIZARD_MEDIUM.xStart, yPosition: WIZARD_MEDIUM.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        const responseBody = response.body as { msg: string };

        expect(responseBody.msg).toBe("Game won");
      });
    });
  });
});
