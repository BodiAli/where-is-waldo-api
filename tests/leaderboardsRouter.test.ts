import express from "express";
import request from "supertest";
import leaderboardsRouter from "../routes/leaderboardsRouter.js";
import prisma from "../prisma/prismaClient.js";
import type { Leaderboard, User } from "@prisma/client";

const app = express();

app.use("/leaderboards", leaderboardsRouter);

describe("leaderboards router", () => {
  describe("get all leaderboards", () => {
    describe("given GET request to /leaderboards", () => {
      it("should return 200 status code and return all leaderboards", async () => {
        await prisma.leaderboard.create({
          data: {
            Illustration: {
              connect: {
                difficulty: "easy",
              },
            },
          },
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
        await prisma.leaderboard.create({
          data: {
            Illustration: {
              connect: {
                difficulty: "hard",
              },
            },
          },
        });

        const response = await request(app).get("/leaderboards").expect("Content-type", /json/).expect(200);

        const responseBody = response.body as { leaderboards: Leaderboard[] };

        expect(responseBody.leaderboards.length).toBe(3);
      });
    });
  });

  describe("get single leaderboard", () => {
    describe("given GET request to /leaderboards/leaderboardId", () => {
      it("should return 200 status code and return leaderboard with all users in it ordered by score", async () => {
        const leaderboard = await prisma.leaderboard.create({
          data: {
            Illustration: {
              connect: {
                difficulty: "medium",
              },
            },
            Users: {
              create: [
                {
                  name: "Bodi",
                  score: 5 * 60 * 1000, // 5 mins
                },
                {
                  name: "Joe",
                  score: 3 * 60 * 1000, // 3 mins
                },
                {
                  name: "Jane",
                  score: 4 * 60 * 1000, // 4 mins
                },
              ],
            },
          },
        });

        const response = await request(app)
          .get(`/leaderboards/${leaderboard.id}`)
          .expect("Content-type", /json/)
          .expect(200);

        const { leaderboard: leaderboardResponse } = response.body as {
          leaderboard: Leaderboard & { Users: User[] };
        };

        expect(leaderboardResponse.Users[0]!.name).toBe("Joe");
        expect(leaderboardResponse.Users[1]!.name).toBe("Jane");
        expect(leaderboardResponse.Users[2]!.name).toBe("Bodi");
      });
    });
  });
});
