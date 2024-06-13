import { Router } from 'express';
import validateRequest from '../middlewares/validateRequest';
import authMiddleware from '../middlewares/authMiddleware';
import { createTeamSchema } from '../schemas/teams/createTeamSchema';
import { newTeam, addMemberToTeam } from '../controllers/teamController';
import { addMemberToTeamSchema } from '../schemas/teams/addMemberToTeamSchema';

const router = Router();

router.post('/create', authMiddleware ,validateRequest(createTeamSchema), newTeam);
router.post('/:teamId/addMember', authMiddleware, validateRequest(addMemberToTeamSchema), addMemberToTeam);

export default router;