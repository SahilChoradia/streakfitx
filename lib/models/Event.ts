import { Schema, models, model } from "mongoose";
const S = new Schema({ title: { type: String, required: true }, description: String, date: { type: Date, required: true }, location: String,
  category: { type: String, enum: ["Marathon", "Bootcamp", "Workshop", "Competition"], default: "Workshop" },
  capacity: { type: Number, default: 30 }, registeredUsers: [{ type: Schema.Types.ObjectId, ref: "User" }] }, { timestamps: true });
export default models.Event || model("Event", S);
