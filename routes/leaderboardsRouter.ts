import { Router } from "express";
import * as leaderboardsController from "../controllers/leaderboardsController.js";

const leaderboardsRouter = Router();

leaderboardsRouter.get("/", leaderboardsController.getLeaderboards);
leaderboardsRouter.get("/:leaderboardId", leaderboardsController.getLeaderboard);

export default leaderboardsRouter;
