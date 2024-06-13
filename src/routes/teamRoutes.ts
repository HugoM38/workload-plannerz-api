import { Router } from 'express';
import validateRequest from '../middlewares/validateRequest';
import authMiddleware from '../middlewares/authMiddleware';
import { createTeamSchema } from '../schemas/teams/createTeamSchema';
import { newTeam, addMemberToTeam, getTeamMembers, removeMemberFromTeam } from '../controllers/teamController';
import { addMemberToTeamSchema } from '../schemas/teams/addMemberToTeamSchema';
import { removeMemberFromTeamSchema } from '../schemas/teams/removeMemberFromTeamSchema';

const router = Router();

router.post('/create', authMiddleware ,validateRequest(createTeamSchema), newTeam);
router.post('/:teamId/addMember', authMiddleware, validateRequest(addMemberToTeamSchema), addMemberToTeam);
router.get('/:teamId/members', authMiddleware, getTeamMembers);
router.post('/:teamId/removeMember', authMiddleware, validateRequest(removeMemberFromTeamSchema), removeMemberFromTeam);

export default router;