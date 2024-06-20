import Task from "../models/taskModel";
import Team from "../models/teamModel";
import userModel from "../models/userModel";
import mongoose from "mongoose";

const createTask = async (
  name: string,
  owner: string | undefined,
  team: string,
  priority: number,
  timeEstimation: number,
  dueDate: number, 
  requesterId: string
) => {
  const teamId = new mongoose.Types.ObjectId(team);
  const findTeam = await Team.findOne({ _id: teamId });
  if (!findTeam) throw new Error("Équipe non trouvée");

  if (!findTeam.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  if (dueDate < Date.now()) throw new Error("La date d'échéance doit être après la date actuelle");

  if (owner === undefined) {
    const newTask = new Task({
      name,
      priority,
      team: teamId,
      dueDate,
      timeEstimation,
      state: "En cours",
      creationDate: Date.now(),
    });
    return await newTask.save();
  } else {
    const ownerId = new mongoose.Types.ObjectId(owner);
    const findUser = await userModel.findOne({ _id: ownerId });
    if (!findUser) throw new Error("Utilisateur non trouvé");

    const newTask = new Task({
      name,
      owner: ownerId,
      team: teamId,
      priority,
      timeEstimation,
      state: "En cours",
      creationDate: Date.now(),
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
  if (!findUser) throw new Error("Utilisateur non trouvé");

  const team = await Team.findById(teamId);
  if (!team) throw new Error("Équipe non trouvée");

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  return await Task.find({ owner: ownerId, team: teamId });
};

const updateTaskPriorityById = async (
  taskId: string,
  priority: number,
  requesterId: string
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Tâche non trouvée");

  const team = await Team.findById(task.team);
  if (!team) throw new Error("Équipe non trouvée");

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  task.priority = priority;
  return await task.save();
};

const updateTaskDueDateById = async (
  taskId: string,
  dueDate: number,
  requesterId: string
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Tâche non trouvée");

  if (task.creationDate > dueDate) {
    throw new Error("La date d'échéance doit être après la date de création");
  }

  const team = await Team.findById(task.team);
  if (!team) throw new Error("Équipe non trouvée");

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  task.dueDate = dueDate;
  return await task.save();
};

const updateTaskOwnerById = async (
  taskId: string,
  owner: string,
  requesterId: string
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Tâche non trouvée");

  const team = await Team.findById(task.team);
  if (!team) throw new Error("Équipe non trouvée");

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  const ownerId = new mongoose.Types.ObjectId(owner);
  const findUser = await userModel.findOne({ _id: ownerId });
  if (!findUser) throw new Error("Utilisateur non trouvé");

  task.owner = ownerId;
  return await task.save();
};

const updateTimeEstimationById = async (
  taskId: string,
  timeEstimation: number,
  requesterId: string
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Tâche non trouvée");

  const team = await Team.findById(task.team);
  if (!team) throw new Error("Équipe non trouvée");

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  task.timeEstimation = timeEstimation;
  return await task.save();
};

const updateTaskNameById = async (
  taskId: string,
  name: string,
  requesterId: string
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Tâche non trouvée");

  const team = await Team.findById(task.team);
  if (!team) throw new Error("Équipe non trouvée");

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  task.name = name;
  return await task.save();
};

const validateTaskById = async (taskId: string, requesterId: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Tâche non trouvée");

  const team = await Team.findById(task.team);
  if (!team) throw new Error("Équipe non trouvée");

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  task.state = "Validée";
  return await task.save();
};

const deleteTaskById = async (taskId: string, requesterId: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Tâche non trouvée");

  const team = await Team.findById(task.team);
  if (!team) throw new Error("Équipe non trouvée");

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  return await Task.findByIdAndDelete(taskId);
};

const getTasksOfATeamById = async (teamId: string, requesterId: string) => {
  const team = await Team.findById(teamId);
  if (!team) throw new Error("Équipe non trouvée");

  if (!team.members.map((member) => member.toString()).includes(requesterId)) {
    throw new Error("Vous n'êtes pas membre de cette équipe");
  }

  return await Task.find({ team: teamId });
};

export {
  createTask,
  getTasksOfATeamByUserId,
  getTasksOfATeamById,
  updateTaskPriorityById,
  updateTaskDueDateById,
  updateTaskOwnerById,
  updateTimeEstimationById,
  updateTaskNameById,
  validateTaskById,
  deleteTaskById,
};
