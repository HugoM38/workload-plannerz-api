import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getTeams, getUser } from "../controllers/userController";

const router = Router();

router.get("/teams", authMiddleware, getTeams);
router.get("/:userId", authMiddleware, getUser);

export default router;
