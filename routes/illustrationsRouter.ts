import { Router } from "express";
import * as illustrationsController from "../controllers/illustrationsController.js";

const illustrationsRouter = Router();

illustrationsRouter.get("/", illustrationsController.getIllustrations);
illustrationsRouter.get("/:illustrationId", illustrationsController.getIllustration);
illustrationsRouter.post("/:illustrationId/leaderboard", illustrationsController.createLeaderboard);
illustrationsRouter.post("/:illustrationId/:characterId", illustrationsController.validate);

export default illustrationsRouter;
