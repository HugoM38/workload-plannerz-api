import { Request, Response } from "express";
import {
  changeTeamName,
  changeTeamOwner,
  createTeam,
  deleteMemberFromTeam,
  getMemberWorkloadById,
  getNonMembersInTeam,
  getTeamMembersById,
  getTeamWorkloadById,
  newMemberToTeam,
} from "../services/teamService";

const newTeam = async (req: Request, res: Response) => {
  try {
    const { name, owner } = req.body;
    const team = await createTeam(name, owner);
    res.status(201).json(team);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const addMemberToTeam = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { teamId } = req.params;
  const { userId } = req.body;

  try {
    const team = await newMemberToTeam(teamId, userId, req.user!);
    res.status(200).json(team);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      } else if (error.message === "Vous n'êtes pas le propriétaire de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas le propriétaire de cette équipe" });
      } else if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const getTeamMembers = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { teamId } = req.params;

  try {
    const members = await getTeamMembersById(teamId, req.user!);
    res.status(200).json(members);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      } else if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const removeMemberFromTeam = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { teamId } = req.params;
  const { userId } = req.body;

  try {
    const team = await deleteMemberFromTeam(teamId, userId, req.user!);
    res.status(200).json(team);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      } else if (error.message === "Vous n'êtes pas le propriétaire de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas le propriétaire de cette équipe" });
      } else if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const changeOwner = async (req: Request & { user?: string }, res: Response) => {
  const { teamId } = req.params;
  const { userId } = req.body;

  try {
    const team = await changeTeamOwner(teamId, userId, req.user!);
    res.status(200).json(team);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      } else if (error.message === "Vous n'êtes pas le propriétaire de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas le propriétaire de cette équipe" });
      } else if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const changeName = async (req: Request & { user?: string }, res: Response) => {
  const { teamId } = req.params;
  const { name } = req.body;

  try {
    const team = await changeTeamName(teamId, name, req.user!);
    res.status(200).json(team);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      } else if (error.message === "Vous n'êtes pas le propriétaire de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas le propriétaire de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const getNonMembers = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { teamId } = req.params;

  try {
    const nonMembers = await getNonMembersInTeam(teamId, req.user!);
    res.status(200).json(nonMembers);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      } else if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const getMemberWorkload = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { teamId, memberId } = req.params;

  try {
    const workload = await getMemberWorkloadById(teamId, memberId, req.user!);
    res.status(200).json({workload});
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      } else if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      } else if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      } else if (error.message === "L'utilisateur n'est pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "L'utilisateur n'est pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const getTeamWorkload = async (
  req: Request & { user?: string },
  res: Response,
) => {
  const { teamId } = req.params;

  try {
    const workload = await getTeamWorkloadById(teamId, req.user!);
    res.status(200).json({workload});
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Équipe non trouvée") {
        return res.status(404).json({ error: "Équipe non trouvée" });
      } else if (error.message === "Vous n'êtes pas membre de cette équipe") {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas membre de cette équipe" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

export {
  newTeam,
  addMemberToTeam,
  getTeamMembers,
  removeMemberFromTeam,
  changeOwner,
  changeName,
  getNonMembers,
  getMemberWorkload,
  getTeamWorkload,
};
