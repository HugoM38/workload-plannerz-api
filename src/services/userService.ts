import Team from "../models/teamModel";
import mongoose from "mongoose";
import userModel from "../models/userModel";

const getTeamsByUser = async (userId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const findUser = await userModel.findOne({ _id: userObjectId });
  if (!findUser) throw new Error("Utilisateur non trouvé");

  return await Team.find({ members: userId });
};

const getUserById = async (userId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const user = await userModel.findOne({ _id: userObjectId });
  if (!user) throw new Error("Utilisateur non trouvé");

  return user;
};

export { getTeamsByUser, getUserById };
