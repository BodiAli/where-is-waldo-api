import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import illustrationsRouter from "./routes/illustrationsRouter.js";
import validateCharacterRouter from "./routes/validateCharacterRouter.js";

const app = express();

app.use(express.json());

app.use("/illustrations", illustrationsRouter);
app.use("/validate", validateCharacterRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Resource not found" });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: error.message ? error.message : error });
});

const port = process.env?.["PORT"] ?? 3000;

app.listen(port, () => {
  console.log(`App is running on port: ${port}!`);
});
