import { Router } from 'express';
import validateRequest from '../middlewares/validateRequest';
import authMiddleware from '../middlewares/authMiddleware';
import { createTaskSchema } from '../schemas/tasks/createTaskSchema';
import { newTask } from '../controllers/taskController';

const router = Router();

router.post('/create', authMiddleware ,validateRequest(createTaskSchema), newTask);

export default router;