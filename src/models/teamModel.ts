import mongoose, { Document, Schema } from "mongoose";

export interface ITeam extends Document {
  name: string;
  owner: string;
  members: string[];
}

const TeamSchema: Schema = new Schema({});

export default mongoose.model<ITeam>("Team", TeamSchema);
