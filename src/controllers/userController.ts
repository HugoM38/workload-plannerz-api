import { Request, Response } from "express";
import { getTeamsByUser, getUserById } from "../services/userService";

const getTeams = async (req: Request & { user?: string }, res: Response) => {
  try {
    const userId = req.user;
    const teams = await getTeamsByUser(userId!);
    res.status(200).json(teams);
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

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await getUserById(userId);
    res.status(200).json(user);
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

export { getTeams, getUser };
