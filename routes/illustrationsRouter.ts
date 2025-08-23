import { Router } from "express";
import * as illustrationsController from "../controllers/illustrationsController.js";

const illustrationsRouter = Router();

illustrationsRouter.get("/", illustrationsController.getIllustrations);

export default illustrationsRouter;
