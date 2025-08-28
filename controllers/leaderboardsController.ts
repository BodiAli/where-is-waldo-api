import type { Request, Response } from "express";

export function getLeaderboards(req: Request, res: Response) {
  res.status(200).json({ hi: "123" });
}
