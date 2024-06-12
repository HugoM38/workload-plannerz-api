import Task from "../models/taskModel";
import teamModel from "../models/teamModel";
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
  const findTeam = await teamModel.findOne({ _id: teamId });
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

export { createTask };
