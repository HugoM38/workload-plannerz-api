import { Router } from 'express';
import validateRequest from '../middlewares/validateRequest';
import authMiddleware from '../middlewares/authMiddleware';
import { createTeamSchema } from '../schemas/teams/createTeamSchema';
import { newTeam, addMemberToTeam, getTeamMembers } from '../controllers/teamController';
import { addMemberToTeamSchema } from '../schemas/teams/addMemberToTeamSchema';

const router = Router();

router.post('/create', authMiddleware ,validateRequest(createTeamSchema), newTeam);
router.post('/:teamId/addMember', authMiddleware, validateRequest(addMemberToTeamSchema), addMemberToTeam);
router.get('/:teamId/members', authMiddleware, getTeamMembers);

export default router;