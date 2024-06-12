import Task from "../models/taskModel";

const createTask = async (
  name: string,
  owner: string | undefined,
  priority: number,
  dueDate: number
) => {
  if (owner === undefined) {
    const newTask = new Task({ name, priority, dueDate });
    return await newTask.save();
  } else {
    const newTask = new Task({ name, owner, priority, dueDate });
    return await newTask.save();
  }
};

export { createTask };
