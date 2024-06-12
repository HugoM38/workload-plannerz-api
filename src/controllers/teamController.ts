import { Request, Response } from "express";
import { createTeam } from "../services/teamService";

const newTeam = async (req: Request, res: Response) => {
  try {
    const { name, owner } = req.body;
    const team = await createTeam(name, owner);
    res.status(201).json(team);
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

export { newTeam };
