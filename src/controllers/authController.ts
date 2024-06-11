import { Request, Response } from 'express';
import { register, login } from '../services/authService';
import mongoose from 'mongoose';

const signup = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, job, email, password } = req.body;
    const user = await register(firstname, lastname, job, email, password);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (isMongoError(error) && error.code === 11000) {
      res.status(409).json({ error: 'Email already exists' });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
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
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

function isMongoError(error: any): error is { code: number } {
    return error && typeof error === 'object' && 'code' in error;
  }

export { signup, signin };
