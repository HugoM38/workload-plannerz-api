import { Request, Response } from "express";
import {
  createTask,
  deleteTaskById,
  getTasksOfATeamById,
  getTasksOfATeamByUserId,
  updateTaskDueDateById,
  updateTaskNameById,
  updateTaskOwnerById,
  updateTaskPriorityById,
  updateTimeEstimationById,
  validateTaskById,
} from "../services/taskService";

const newTask = async (req: Request & { user?: string }, res: Response) => {
  try {
    const { name, owner, team, priority, timeEstimation, dueDate } = req.body;
    const task = await createTask(
      name,
      owner,
      team,
      priority,
      timeEstimation,
      dueDate,
      req.user!,
    );
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      if (
        error.message === "La date d'échéance doit être après la date actuelle"
      ) {
        return res.status(400).json({
          error: "La date d'échéance doit être après la date actuelle",
        });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const getTasksOfATeamByUser = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { userId, teamId } = req.params;
  try {
    const tasks = await getTasksOfATeamByUserId(userId, teamId, req.user!);
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const updateTaskPriority = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { taskId } = req.params;
  const { priority } = req.body;

  try {
    const task = await updateTaskPriorityById(taskId, priority, req.user!);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Tâche non trouvée") {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const updateTaskDueDate = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { taskId } = req.params;
  const { dueDate } = req.body;

  try {
    const task = await updateTaskDueDateById(taskId, dueDate, req.user!);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Tâche non trouvée") {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      if (
        error.message ===
        "La date d'échéance doit être après la date de création"
      ) {
        return res.status(400).json({
          error: "La date d'échéance doit être après la date de création",
        });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const updateTaskOwner = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { taskId } = req.params;
  const { ownerId } = req.body;

  try {
    const task = await updateTaskOwnerById(taskId, ownerId, req.user!);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Tâche non trouvée") {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const updateTimeEstimation = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { taskId } = req.params;
  const { timeEstimation } = req.body;

  try {
    const task = await updateTimeEstimationById(
      taskId,
      timeEstimation,
      req.user!,
    );
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Tâche non trouvée") {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const updateTaskName = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { taskId } = req.params;
  const { name } = req.body;

  try {
    const task = await updateTaskNameById(taskId, name, req.user!);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Tâche non trouvée") {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const validateTask = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { taskId } = req.params;

  try {
    await validateTaskById(taskId, req.user!);
    res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Tâche non trouvée") {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
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
      if (error.message === "Tâche non trouvée") {
        return res.status(404).json({ error: "Tâche non trouvée" });
      }
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const getTasksOfATeam = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { teamId } = req.params;
  try {
    const tasks = await getTasksOfATeamById(teamId, req.user!);
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      }
      if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
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
  updateTaskName,
  validateTask,
  deleteTask,
};
