import type { Character } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      character: Character;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    startedAt: Date;
  }
}
