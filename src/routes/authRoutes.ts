import { Router } from 'express';
import { signup, signin } from '../controllers/authController';
import { signinSchema } from '../schemas/signinSchema';
import validateRequest from '../middlewares/validateRequest';
import { signupSchema } from '../schemas/signupSchema';

const router = Router();

router.post('/signup', validateRequest(signupSchema), signup);
router.post('/signin', validateRequest(signinSchema), signin);

export default router;