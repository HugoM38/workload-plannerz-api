import { Router } from 'express';;
import authMiddleware from '../middlewares/authMiddleware';
import { getTeams } from '../controllers/userController';

const router = Router();

router.get('/teams', authMiddleware, getTeams);

export default router;