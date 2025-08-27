import "dotenv/config";
import cors from "cors";
import express, { type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import illustrationsRouter from "./routes/illustrationsRouter.js";

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  })
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/illustrations", illustrationsRouter);

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
