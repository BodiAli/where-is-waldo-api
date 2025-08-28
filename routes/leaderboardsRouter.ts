import { Router } from "express";
import * as leaderboardsController from "../controllers/leaderboardsController.js";

const leaderboardsRouter = Router();

leaderboardsRouter.get("/", leaderboardsController.getLeaderboards);

export default leaderboardsRouter;
