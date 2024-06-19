import { Router } from "express";
import validateRequest from "../middlewares/validateRequest";
import authMiddleware from "../middlewares/authMiddleware";
import { createTeamSchema } from "../schemas/teams/createTeamSchema";
import {
  newTeam,
  addMemberToTeam,
  getTeamMembers,
  removeMemberFromTeam,
  changeOwner,
  getNonMembers,
  changeName,
  getMemberWorkload,
  getTeamWorkload,
} from "../controllers/teamController";
import { addMemberToTeamSchema } from "../schemas/teams/addMemberToTeamSchema";
import { removeMemberFromTeamSchema } from "../schemas/teams/removeMemberFromTeamSchema";
import { changeOwnerSchema } from "../schemas/teams/changeOwnerSchema";
import { changeNameSchema } from "../schemas/teams/changeNameSchema";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  validateRequest(createTeamSchema),
  newTeam,
);
router.post(
  "/:teamId/addMember",
  authMiddleware,
  validateRequest(addMemberToTeamSchema),
  addMemberToTeam,
);
router.get("/:teamId/members", authMiddleware, getTeamMembers);
router.post(
  "/:teamId/removeMember",
  authMiddleware,
  validateRequest(removeMemberFromTeamSchema),
  removeMemberFromTeam,
);
router.patch(
  "/:teamId/changeOwner",
  authMiddleware,
  validateRequest(changeOwnerSchema),
  changeOwner,
);
router.patch(
  "/:teamId/changeName",
  authMiddleware,
  validateRequest(changeNameSchema),
  changeName,
);
router.get("/:teamId/nonMembers", authMiddleware, getNonMembers);
router.get("/:teamId/:memberId/workload", authMiddleware, getMemberWorkload);
router.get("/:teamId/workload", authMiddleware, getTeamWorkload);

export default router;
