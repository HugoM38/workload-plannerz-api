import { Request, Response } from "express";
import { createTask } from "../services/taskService";

const newTask = async (req: Request, res: Response) => {
  try {
    const { name, owner, priority, dueDate } = req.body;
    const user = await createTask(name, owner, priority, dueDate);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export { newTask };
