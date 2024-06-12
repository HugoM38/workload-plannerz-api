import Task from "../models/taskModel";
import teamModel from "../models/teamModel";
import userModel from "../models/userModel";

const createTask = async (
  name: string,
  owner: string | undefined,
  team: string,
  priority: number,
  dueDate: number
) => {
    const findTeam = await teamModel.findOne({ _id: team });
    if(!findTeam) throw new Error('Team not found');
  if (owner === undefined) {
    const newTask = new Task({ name, priority, team, dueDate });
    return await newTask.save();
  } else {
    const findUser = userModel.findOne({ _id: owner });
    if (!findUser) throw new Error("User not found");
    const newTask = new Task({ name, owner, team, priority, dueDate });
    return await newTask.save();
  }
};

export { createTask };
