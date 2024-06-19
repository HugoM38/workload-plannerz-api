import mongoose, { Document, Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

export interface ITask extends Document {
  name: string;
  owner?: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId;
  priority: number;
  timeEstimation: number;
  state: string;
  creationDate: number;
  dueDate: number;
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  owner: { type: ObjectId, ref: 'User', required: false },
  team: { type: ObjectId, ref: 'Team', required: true },
  priority: { type: Number, required: true },
  timeEstimation: { type: Number, required: false, default: 0},
  dueDate: { type: Number, required: true },
  state: { type: String, required: false, default: "En cours" },
  creationDate: { type: Number, required: false, default: Date.now()}
});

export default mongoose.model<ITask>("Task", TaskSchema);
