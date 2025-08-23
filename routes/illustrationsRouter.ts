import { Router } from "express";
import * as illustrationsController from "../controllers/illustrationsController.js";

const illustrationsRouter = Router();

illustrationsRouter.get("/", illustrationsController.getIllustrations);
illustrationsRouter.get("/:illustrationId", illustrationsController.getIllustration);

export default illustrationsRouter;
