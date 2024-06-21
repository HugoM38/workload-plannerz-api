import Team from "../models/teamModel";
import mongoose from "mongoose";
import User from "../models/userModel";
import Task from "../models/taskModel";

const createTeam = async (name: string, owner: string) => {
  const ownerId = new mongoose.Types.ObjectId(owner);
  const findUser = await User.findOne({ _id: ownerId });
  if (!findUser) throw new Error("Utilisateur non trouvé");

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
  requesterId: string,
) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Équipe non trouvée");
  }

  if (String(team.owner) !== requesterId) {
    throw new Error("Vous n'êtes pas le propriétaire de cette équipe");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  if (team.members.includes(new mongoose.Types.ObjectId(userId))) {
    throw new Error("L'utilisateur est déjà membre de cette équipe");
  }

  team.members.push(new mongoose.Types.ObjectId(userId));
  return await team.save();
};

const getTeamMembersById = async (teamId: string, requesterId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Équipe non trouvée");
  }

  const membersIds = team.members.map((member) => member.toString());
  if (!membersIds.includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  return await User.find({ _id: { $in: team.members } });
};

const deleteMemberFromTeam = async (
  teamId: string,
  userId: string,
  requesterId: string,
) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Équipe non trouvée");
  }

  if (String(team.owner) !== requesterId) {
    throw new Error("Vous n'êtes pas le propriétaire de cette équipe");
  }

  if (String(team.owner) === userId) {
    throw new Error("Vous ne pouvez pas retirer le propriétaire de l'équipe");
  }

  if (!team.members.includes(new mongoose.Types.ObjectId(userId))) {
    throw new Error("L'utilisateur n'est pas membre de cette équipe");
  }

  team.members = team.members.filter((member) => member.toString() !== userId);
  return await team.save();
};

const changeTeamOwner = async (
  teamId: string,
  userId: string,
  requesterId: string,
) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Équipe non trouvée");
  }

  if (String(team.owner) !== requesterId) {
    throw new Error("Vous n'êtes pas le propriétaire de cette équipe");
  }

  if (!team.members.includes(new mongoose.Types.ObjectId(userId))) {
    throw new Error("L'utilisateur n'est pas membre de cette équipe");
  }

  team.owner = new mongoose.Types.ObjectId(userId);
  return await team.save();
};

const changeTeamName = async (
  teamId: string,
  newName: string,
  requesterId: string,
) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Équipe non trouvée");
  }

  if (String(team.owner) !== requesterId) {
    throw new Error("Vous n'êtes pas le propriétaire de cette équipe");
  }

  team.name = newName;
  return await team.save();
};

const getNonMembersInTeam = async (teamId: string, requesterId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Équipe non trouvée");
  }

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  const membersIds = team.members.map((member) => member.toString());
  return await User.find({ _id: { $nin: membersIds } });
};

const getMemberWorkloadById = async (
  teamId: string,
  userId: string,
  requesterId: string,
) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Équipe non trouvée");
  }

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  if (!team.members.map((member) => member.toString()).includes(userId)) {
    throw new Error("L'utilisateur n'est pas membre de cette équipe");
  }

  const tasks = await Task.find({ owner: userId, team: teamId });
  var workload = 0;
  for (const task of tasks) {
    if(task.state === "En cours") {
      workload += task.timeEstimation;
    }
  }

  return workload;
};

const getTeamWorkloadById = async (teamId: string, requesterId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Équipe non trouvée");
  }

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  const tasks = await Task.find({ team: teamId });
  var workload = 0;
  for (const task of tasks) {
    if(task.state === "En cours") {
      workload += task.timeEstimation;
    }
  }

  return workload;
};

export {
  createTeam,
  newMemberToTeam,
  getTeamMembersById,
  deleteMemberFromTeam,
  changeTeamOwner,
  changeTeamName,
  getNonMembersInTeam,
  getMemberWorkloadById,
  getTeamWorkloadById,
};
