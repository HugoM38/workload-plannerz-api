import { Router } from 'express';
import validateRequest from '../middlewares/validateRequest';
import authMiddleware from '../middlewares/authMiddleware';
import { createTeamSchema } from '../schemas/createTeamSchema';
import { newTeam } from '../controllers/teamController';

const router = Router();

router.post('/create', authMiddleware ,validateRequest(createTeamSchema), newTeam);

export default router;