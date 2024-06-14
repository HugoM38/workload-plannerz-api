import { Request, Response } from "express";
import { createTask, getTasksOfATeamByUserId } from "../services/taskService";

const newTask = async (req: Request, res: Response) => {
  try {
    const { name, owner, team, priority, dueDate } = req.body;
    const task = await createTask(name, owner, team, priority, dueDate);
    res.status(201).json(task);
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

const getTasksOfATeamByUser = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { userId, teamId } = req.params;
  try {
    const tasks = await getTasksOfATeamByUserId(userId, teamId, req.user!);
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      if (error.message === "User not authorized") {
        return res.status(403).json({ error: "User not authorized" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export { newTask, getTasksOfATeamByUser };
