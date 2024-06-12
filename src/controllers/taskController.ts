import { Request, Response } from "express";
import { createTask } from "../services/taskService";

const newTask = async (req: Request, res: Response) => {
  try {
    const { name, owner, team, priority, dueDate } = req.body;
    const user = await createTask(name, owner, team, priority, dueDate);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      }
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export { newTask };
