import { Request, Response } from "express";
import {
  changeTeamName,
  changeTeamOwner,
  createTeam,
  deleteMemberFromTeam,
  getNonMembersInTeam,
  getTeamMembersById,
  newMemberToTeam,
} from "../services/teamService";

const newTeam = async (req: Request, res: Response) => {
  try {
    const { name, owner } = req.body;
    const team = await createTeam(name, owner);
    res.status(201).json(team);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const addMemberToTeam = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { teamId } = req.params;
  const { userId } = req.body;

  try {
    const team = await newMemberToTeam(teamId, userId, req.user!);
    res.status(200).json(team);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      } else if (error.message === "You are not the owner of this team") {
        return res
          .status(403)
          .json({ error: "You are not the owner of this team" });
      } else if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const getTeamMembers = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { teamId } = req.params;

  try {
    const members = await getTeamMembersById(teamId, req.user!);
    res.status(200).json(members);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      } else if (error.message === "You are not a member of this team") {
        return res
          .status(403)
          .json({ error: "You are not a member of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const removeMemberFromTeam = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { teamId } = req.params;
  const { userId } = req.body;

  try {
    const team = await deleteMemberFromTeam(teamId, userId, req.user!);
    res.status(200).json(team);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      } else if (error.message === "You are not the owner of this team") {
        return res
          .status(403)
          .json({ error: "You are not the owner of this team" });
      } else if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
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
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      } else if (error.message === "You are not the owner of this team") {
        return res
          .status(403)
          .json({ error: "You are not the owner of this team" });
      } else if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
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
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      } else if (error.message === "You are not the owner of this team") {
        return res
          .status(403)
          .json({ error: "You are not the owner of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
}

const getNonMembers = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { teamId } = req.params;

  try {
    const nonMembers = await getNonMembersInTeam(teamId, req.user!);
    res.status(200).json(nonMembers);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Team not found") {
        return res.status(404).json({ error: "Team not found" });
      } else if (error.message === "You are not a member of this team") {
        return res
          .status(403)
          .json({ error: "You are not a member of this team" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
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
  getNonMembers
};
