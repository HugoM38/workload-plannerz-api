import Team from "../models/teamModel";
import mongoose from "mongoose";
import userModel from "../models/userModel";

const createTeam = async (name: string, owner: string) => {
  const ownerId = new mongoose.Types.ObjectId(owner);
  const findUser = await userModel.findOne({ _id: ownerId });
  if (!findUser) throw new Error("User not found");

  const members = [];
  members.push(ownerId);

  const newTeam = new Team({
    name,
    owner: ownerId,
    members: members,
  });

  return await newTeam.save();
};

export { createTeam };
