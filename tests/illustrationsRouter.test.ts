import express from "express";
import request from "supertest";
import type { Illustration } from "@prisma/client";
import illustrationsRouter from "../routes/illustrationsRouter.js";

const app = express();

app.use("/illustrations", illustrationsRouter);

interface IllustrationsResponse {
  illustrations: Illustration[];
}

describe("illustrationsRouter routes", () => {
  describe("given GET request to /illustrations", () => {
    it("should return 200 status and all illustrations", async () => {
      const response = await request(app).get("/illustrations").expect("Content-type", /json/).expect(200);

      const responseBody = response.body as IllustrationsResponse;

      console.log(responseBody.illustrations);

      expect(responseBody.illustrations).toMatchObject([
        { difficulty: "easy" },
        { difficulty: "medium" },
        { difficulty: "hard" },
      ]);
    });
  });
});
