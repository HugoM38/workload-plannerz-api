import { Router } from "express";
import validateRequest from "../middlewares/validateRequest";
import authMiddleware from "../middlewares/authMiddleware";
import { createTaskSchema } from "../schemas/tasks/createTaskSchema";
import {
  deleteTask,
  getTasksOfATeam,
  getTasksOfATeamByUser,
  newTask,
  updateTaskDueDate,
  updateTaskName,
  updateTaskOwner,
  updateTaskPriority,
  updateTimeEstimation,
  validateTask,
} from "../controllers/taskController";
import { updateTaskPrioritySchema } from "../schemas/tasks/updateTaskPrioritySchema";
import { updateTaskDueDateSchema } from "../schemas/tasks/updateTaskDueDateSchema";
import { updateTaskOwnerSchema } from "../schemas/tasks/updateTaskOwnerSchema";
import { updateTimeEstimationSchema } from "../schemas/tasks/updateTimeEstimationSchema";
import { updateTaskNameSchema } from "../schemas/tasks/updateTaskNameSchema";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  validateRequest(createTaskSchema),
  newTask,
);
router.get("/:teamId/:userId", authMiddleware, getTasksOfATeamByUser);
router.get("/:teamId", authMiddleware, getTasksOfATeam);
router.patch(
  "/:taskId/priority",
  authMiddleware,
  validateRequest(updateTaskPrioritySchema),
  updateTaskPriority,
);
router.patch(
  "/:taskId/dueDate",
  authMiddleware,
  validateRequest(updateTaskDueDateSchema),
  updateTaskDueDate,
);
router.patch(
  "/:taskId/owner",
  authMiddleware,
  validateRequest(updateTaskOwnerSchema),
  updateTaskOwner,
);
router.patch(
  "/:taskId/timeEstimation",
  authMiddleware,
  validateRequest(updateTimeEstimationSchema),
  updateTimeEstimation,
);
router.patch(
  "/:taskId/name",
  authMiddleware,
  validateRequest(updateTaskNameSchema),
  updateTaskName,
);
router.patch("/:taskId/validate", authMiddleware, validateTask);
router.delete("/:taskId", authMiddleware, deleteTask);

export default router;
