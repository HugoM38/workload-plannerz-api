import { Request, Response } from "express";
import {
  createTask,
  deleteTaskById,
  getTasksOfATeamById,
  getTasksOfATeamByUserId,
  updateTaskDueDateById,
  updateTaskOwnerById,
  updateTaskPriorityById,
  updateTimeEstimationById,
  validateTaskById,
} from "../services/taskService";

const newTask = async (req: Request, res: Response) => {
  try {
    const { name, owner, team, priority, timeEstimation, dueDate } = req.body;
    const task = await createTask(name, owner, team, priority, timeEstimation, dueDate);
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
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      }
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      if (error.message === "You are not a member of this team") {
        return res
          .status(403)
          .json({ error: "You are not a member of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const updateTaskPriority = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { taskId } = req.params;
  const { priority } = req.body;

  try {
    const task = await updateTaskPriorityById(taskId, priority, req.user!);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: "Task not found" });
      }
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      }
      if (error.message === "You are not a member of this team") {
        return res
          .status(403)
          .json({ error: "You are not a member of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const updateTaskDueDate = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { taskId } = req.params;
  const { dueDate } = req.body;

  try {
    const task = await updateTaskDueDateById(taskId, dueDate, req.user!);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: "Task not found" });
      }
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      }
      if (error.message === "You are not a member of this team") {
        return res
          .status(403)
          .json({ error: "You are not a member of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const updateTaskOwner = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { taskId } = req.params;
  const { ownerId } = req.body;

  try {
    const task = await updateTaskOwnerById(taskId, ownerId, req.user!);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: "Task not found" });
      }
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      }
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      if (error.message === "You are not a member of this team") {
        return res
          .status(403)
          .json({ error: "You are not a member of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const updateTimeEstimation = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { taskId } = req.params;
  const { timeEstimation } = req.body;

  try {
    const task = await updateTimeEstimationById(taskId, timeEstimation, req.user!);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: "Task not found" });
      }
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      }
      if (error.message === "You are not a member of this team") {
        return res
          .status(403)
          .json({ error: "You are not a member of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const validateTask = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { taskId } = req.params;

  try {
    await validateTaskById(taskId, req.user!);
    res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: "Task not found" });
      }
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      }
      if (error.message === "You are not a member of this team") {
        return res
          .status(403)
          .json({ error: "You are not a member of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const deleteTask = async (req: Request & { user?: string }, res: Response) => {
  const { taskId } = req.params;

  try {
    await deleteTaskById(taskId, req.user!);
    res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: "Task not found" });
      }
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      }
      if (error.message === "You are not a member of this team") {
        return res
          .status(403)
          .json({ error: "You are not a member of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const getTasksOfATeam = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { teamId } = req.params;
  try {
    const tasks = await getTasksOfATeamById(teamId, req.user!);
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      }
      if (error.message === "You are not a member of this team") {
        return res
          .status(403)
          .json({ error: "You are not a member of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export {
  newTask,
  getTasksOfATeamByUser,
  getTasksOfATeam,
  updateTaskPriority,
  updateTaskDueDate,
  updateTaskOwner,
  updateTimeEstimation,
  validateTask,
  deleteTask,
};
