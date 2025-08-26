import { Router } from "express";
import * as validateCharacterController from "../controllers/validateCharacterController.js";

const validateCharacterRouter = Router();

validateCharacterRouter.post("/:characterId", validateCharacterController.validate);

export default validateCharacterRouter;
