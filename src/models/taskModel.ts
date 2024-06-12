import mongoose, { Document, Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

export interface ITask extends Document {
  name: string;
  owner?: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId;
  priority: number;
  dueDate: number;
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  owner: { type: ObjectId, ref: 'User', required: false },
  team: { type: ObjectId, ref: 'Team', required: true },
  priority: { type: Number, required: true },
  dueDate: { type: Number, required: true },
});

export default mongoose.model<ITask>("Task", TaskSchema);
