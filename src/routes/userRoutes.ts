import { Router } from 'express';
import validateRequest from '../middlewares/validateRequest';
import authMiddleware from '../middlewares/authMiddleware';
import { createTeamSchema } from '../schemas/teams/createTeamSchema';
import { getTeams } from '../controllers/userController';

const router = Router();

router.get('/teams', authMiddleware, getTeams);

export default router;