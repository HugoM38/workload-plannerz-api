import Task from "../models/taskModel";
import Team from "../models/teamModel";
import userModel from "../models/userModel";
import mongoose from "mongoose";

const createTask = async (
  name: string,
  owner: string | undefined,
  team: string,
  priority: number,
  dueDate: number
) => {
  const teamId = new mongoose.Types.ObjectId(team);
  const findTeam = await Team.findOne({ _id: teamId });
  if (!findTeam) throw new Error("Team not found");

  if (owner === undefined) {
    const newTask = new Task({ name, priority, team: teamId, dueDate });
    return await newTask.save();
  } else {
    const ownerId = new mongoose.Types.ObjectId(owner);
    const findUser = await userModel.findOne({ _id: ownerId });
    if (!findUser) throw new Error("User not found");

    const newTask = new Task({
      name,
      owner: ownerId,
      team: teamId,
      priority,
      dueDate,
    });
    return await newTask.save();
  }
};

const getTasksOfATeamByUserId = async (
  userId: string,
  teamId: string,
  requesterId: string
) => {
  const ownerId = new mongoose.Types.ObjectId(userId);
  const findUser = await userModel.findOne({ _id: ownerId });
  if (!findUser) throw new Error("User not found");

  const team = await Team.findById(teamId);
  if (!team) throw new Error("Team not found");

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("You are not a member of this team");
  }

  return await Task.find({ owner: ownerId, team: teamId });
};

export { createTask, getTasksOfATeamByUserId };
