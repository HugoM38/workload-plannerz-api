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

const newMemberToTeam = async (
  teamId: string,
  userId: string,
  requesterId: string
) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  if (String(team.owner) !== requesterId) {
    throw new Error("You are not the owner of this team");
  }

  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (team.members.includes(new mongoose.Types.ObjectId(userId))) {
    throw new Error("User is already a member of this team");
  }

  team.members.push(new mongoose.Types.ObjectId(userId));
  return await team.save();
};

export { createTeam, newMemberToTeam };
