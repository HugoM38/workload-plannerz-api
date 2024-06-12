import { Request, Response } from "express";
import { register, login } from "../services/authService";

const signup = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, job, email, password } = req.body;
    const user = await register(firstname, lastname, job, email, password);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User already exists") {
        return res.status(409).json({ error: "User already exists" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await login(email, password);
    res.status(200).json({ token, user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export { signup, signin };
