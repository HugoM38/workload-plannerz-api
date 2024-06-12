import { Request, Response } from "express";
import { getTeamsByUser } from "../services/userService";

const getTeams = async (req: Request & { user?: string }, res: Response) => {
  try {
    const userId = req.user;
    const teams = await getTeamsByUser(userId!);
    res.status(200).json(teams);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export { getTeams };
