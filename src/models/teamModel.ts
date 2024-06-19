import mongoose, { Document, Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

export interface ITeam extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  owner: { type: ObjectId, ref: "User", required: true },
  members: [{ type: ObjectId, ref: "User" }],
});

export default mongoose.model<ITeam>("Team", TeamSchema);
