import type { Request, Response } from "express";

export function getIllustrations(_req: Request, res: Response) {
  res.json({ msg: "hii" });
}
