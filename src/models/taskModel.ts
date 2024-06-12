import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  name: string;
  owner: string;
  team: string;
  priority: number;
  dueDate: number;
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  owner: { type: String, required: false },
  team: { type: String, required: true },
  priority: { type: Number, required: true },
  dueDate: { type: Number, required: true },
});

export default mongoose.model<ITask>("Task", TaskSchema);
