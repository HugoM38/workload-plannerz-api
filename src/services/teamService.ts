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

const getTeamMembersById = async (teamId: string, requesterId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  const membersIds = team.members.map((member) => member.toString());
  if (!membersIds.includes(requesterId)) {
    throw new Error("You are not a member of this team");
  }

  return await userModel.find({ _id: { $in: team.members } });
}

const deleteMemberFromTeam = async (teamId: string, userId: string, requesterId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  if (String(team.owner) !== requesterId) {
    throw new Error("You are not the owner of this team");
  }

  if (String(team.owner) === userId) {
    throw new Error("You cannot remove the owner of the team");
  }

  if (!team.members.includes(new mongoose.Types.ObjectId(userId))) {
    throw new Error("User is not a member of this team");
  }

  team.members = team.members.filter((member) => member.toString() !== userId);
  return await team.save();
}

const changeTeamOwner = async (teamId: string, userId: string, requesterId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  if (String(team.owner) !== requesterId) {
    throw new Error("You are not the owner of this team");
  }

  if (!team.members.includes(new mongoose.Types.ObjectId(userId))) {
    throw new Error("User is not a member of this team");
  }

  team.owner = new mongoose.Types.ObjectId(userId);
  return await team.save();
}

export { createTeam, newMemberToTeam, getTeamMembersById, deleteMemberFromTeam, changeTeamOwner };
