import { Schema, models, model } from "mongoose";
const TaskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ["wakeup", "water", "exercise", "diet"], required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  proof: String,
  verifiedByAdmin: { type: Boolean, default: false },
  completedAt: Date,
}, { timestamps: true });
TaskSchema.index({ userId: 1, date: 1, type: 1 }, { unique: true });
export default models.Task || model("Task", TaskSchema);
