import express from "express";
import session from "express-session";
import request from "supertest";
import type { Character, Illustration } from "@prisma/client";
import illustrationsRouter from "../routes/illustrationsRouter.js";
import prisma from "../prisma/prismaClient.js";
import { WALDO_MEDIUM, WENDA_MEDIUM, WIZARD_MEDIUM } from "../types/characterTypes.js";

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  })
);

app.use(express.json());

app.use("/illustrations", illustrationsRouter);

const agent = request.agent(app);

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
        const response = await agent
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

      it("should reinitialize found characters when a request is initiated", async () => {
        const mediumIllustration = await prisma.illustration.findUnique({
          where: {
            difficulty: "medium",
          },
        });

        if (!mediumIllustration) throw new Error("Medium illustration not found");

        const waldo = await prisma.character.findUnique({
          where: {
            name_illustrationId: {
              name: "Waldo",
              illustrationId: mediumIllustration?.id,
            },
          },
        });

        if (!waldo) throw new Error("Waldo character not found");

        await agent.get(`/illustrations/${mediumIllustration.id}`).expect("Content-type", /json/).expect(200);

        const responsePost = await agent
          .post(`/illustrations/${mediumIllustration.id}/${waldo.id}`)
          .type("json")
          .send({ xPosition: WALDO_MEDIUM.xStart, yPosition: WALDO_MEDIUM.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        const responseBodyPost = responsePost.body as { success: true; character: { isFound: boolean } };
        expect(responseBodyPost.success).toBe(true);
        expect(responseBodyPost.character.isFound).toBeTruthy();

        const responseGet = await agent
          .get(`/illustrations/${mediumIllustration.id}`)
          .expect("Content-type", /json/)
          .expect(200);

        const responseBodyGet = responseGet.body as {
          illustration: Illustration & { Characters: (Character & { isFound: boolean })[] };
        };

        const waldoResponse = responseBodyGet.illustration.Characters[0];

        if (!waldoResponse) throw new Error("Waldo response is undefined");

        expect(waldoResponse.isFound).toBeFalsy();
      });
    });
  });

  describe("validate character position", () => {
    describe("given valid character position", () => {
      it("should return 200 status code and mark character as found and send message with success flag", async () => {
        const waldo = await prisma.character.findFirst({
          where: {
            name: "Waldo",
            Illustration: {
              difficulty: "medium",
            },
          },
          omit: {
            xEnd: true,
            xStart: true,
            yEnd: true,
            yStart: true,
          },
        });

        const mediumIllustration = await prisma.illustration.findUnique({
          where: {
            difficulty: "medium",
          },
        });

        if (!mediumIllustration) {
          throw new Error("Medium illustration not found");
        }

        if (!waldo) {
          throw new Error("Waldo is not found");
        }

        const response = await request(app)
          .post(`/illustrations/${mediumIllustration.id}/${waldo.id}`)
          .type("json")
          .send({ xPosition: WALDO_MEDIUM.xStart, yPosition: WALDO_MEDIUM.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        const responseBody = response.body as {
          character: Character & { isFound: boolean };
          msg: string;
          success: boolean;
        };

        expect(responseBody.character.isFound).toBeTruthy();
        expect(responseBody.character).toMatchObject({ ...waldo });
        expect(responseBody.msg).toBe("You found Waldo");
        expect(responseBody.success).toBeTruthy();
      });
    });

    describe("given invalid character position", () => {
      it("should return 200 status code and a success false flag", async () => {
        const waldo = await prisma.character.findFirst({
          where: {
            name: "Waldo",
            Illustration: {
              difficulty: "medium",
            },
          },
        });

        const mediumIllustration = await prisma.illustration.findUnique({
          where: {
            difficulty: "medium",
          },
        });

        if (!mediumIllustration) {
          throw new Error("Medium illustration not found");
        }

        if (!waldo) {
          throw new Error("Waldo is not found");
        }

        const response = await request(app)
          .post(`/illustrations/${mediumIllustration.id}/${waldo.id}`)
          .type("json")
          .send({ xPosition: 200, yPosition: 300 })
          .expect(200);

        const responseBody = response.body as { msg: string; success: boolean };

        expect(responseBody.msg).toBe("Try again");
        expect(responseBody.success).toBeFalsy();
      });
    });

    describe("given last character is found", () => {
      it("should return 200 status with Game won message when all characters are found", async () => {
        const mediumIllustration = await prisma.illustration.findUnique({
          where: {
            difficulty: "medium",
          },
        });

        if (!mediumIllustration) {
          throw new Error("Medium illustration not found");
        }

        const waldo = await prisma.character.findFirst({
          where: {
            name: "Waldo",
            Illustration: {
              difficulty: "medium",
            },
          },
        });

        const wenda = await prisma.character.findFirst({
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

        if (!wizard || !wenda || !waldo) {
          throw new Error("Character not found");
        }

        await agent.get(`/illustrations/${mediumIllustration.id}`).expect("Content-type", /json/).expect(200);

        await agent
          .post(`/illustrations/${mediumIllustration.id}/${waldo.id}`)
          .type("json")
          .send({ xPosition: WALDO_MEDIUM.xStart, yPosition: WALDO_MEDIUM.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        await agent
          .post(`/illustrations/${mediumIllustration.id}/${wenda.id}`)
          .type("json")
          .send({ xPosition: WENDA_MEDIUM.xStart, yPosition: WENDA_MEDIUM.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        const response = await agent
          .post(`/illustrations/${mediumIllustration.id}/${wizard.id}`)
          .type("json")
          .send({ xPosition: WIZARD_MEDIUM.xStart, yPosition: WIZARD_MEDIUM.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        const responseBody = response.body as { msg: string };

        expect(responseBody.msg).toBe("Game won");
      });
    });
  });

  describe("keep track of how long the user took to win the game", () => {
    describe("given request to illustration", () => {
      it("should calculate the duration between session start and game won", async () => {
        const mediumIllustration = await prisma.illustration.findUnique({
          where: {
            difficulty: "medium",
          },
        });

        if (!mediumIllustration) {
          throw new Error("medium illustration not found");
        }

        await agent.get(`/illustrations/${mediumIllustration.id}`).expect(200);

        const waldo = await prisma.character.findUnique({
          where: {
            name_illustrationId: {
              name: "Waldo",
              illustrationId: mediumIllustration.id,
            },
          },
        });

        const wenda = await prisma.character.findUnique({
          where: {
            name_illustrationId: {
              name: "Wenda",
              illustrationId: mediumIllustration.id,
            },
          },
        });

        const wizard = await prisma.character.findUnique({
          where: {
            name_illustrationId: {
              name: "Wizard",
              illustrationId: mediumIllustration.id,
            },
          },
        });

        if (!wizard || !waldo || !wenda) {
          throw new Error("Character not found");
        }

        await agent
          .post(`/illustrations/${mediumIllustration.id}/${waldo.id}`)
          .type("json")
          .send({ xPosition: waldo.xStart, yPosition: waldo.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        await agent
          .post(`/illustrations/${mediumIllustration.id}/${wenda.id}`)
          .type("json")
          .send({ xPosition: wenda.xStart, yPosition: wenda.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await agent
          .post(`/illustrations/${mediumIllustration.id}/${wizard.id}`)
          .type("json")
          .send({ xPosition: wizard.xStart, yPosition: wizard.yStart })
          .expect("Content-type", /json/)
          .expect(200);

        const responseBody = response.body as { msg: string; duration: number };

        expect(responseBody.msg).toBe("Game won");
        expect(responseBody.duration).toBeGreaterThanOrEqual(1000);
      });
    });
  });

  describe("update leaderboard", () => {
    describe("given name", () => {
      it("should create new user and update leaderboard", async () => {
        const mediumIllustration = await prisma.illustration.findUnique({
          where: {
            difficulty: "medium",
          },
        });

        if (!mediumIllustration) throw new Error("illustration not found");

        const mediumLeaderboard = await prisma.leaderboard.create({
          data: {
            illustrationId: mediumIllustration.id,
          },
        });

        const response = await request(app)
          .post(`/illustrations/${mediumIllustration.id}/leaderboard`)
          .type("json")
          .send({ name: "Bodi", duration: 2000 })
          .expect("Content-type", /json/)
          .expect(201);

        const responseBody = response.body as { leaderboardId: string };

        expect(responseBody.leaderboardId).toBe(mediumLeaderboard.id);

        const updatedLeaderboard = await prisma.leaderboard.findUnique({
          where: {
            illustrationId: mediumIllustration.id,
          },
          include: {
            Users: true,
          },
        });

        if (!updatedLeaderboard) throw new Error("Leaderboard not found");

        expect(updatedLeaderboard.Users).toMatchObject([{ name: "Bodi", score: 2000 }]);
      });
    });
  });
});
