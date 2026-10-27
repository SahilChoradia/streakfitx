import { Schema, models, model } from "mongoose";
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["member", "admin"], default: "member" },
  streak: { type: Number, default: 0 },
  lastStreakDate: String,
  rank: { type: String, enum: ["Bronze", "Silver", "Gold", "Platinum"], default: "Bronze" },
  subscription: {
    plan: String, startDate: Date, endDate: Date,
    status: { type: String, enum: ["active", "expired", "none"], default: "none" },
  },
  dietHistory: [{ date: Date, day: String, planHash: String, plan: Object }],
  rewards: [{ name: String, points: Number, unlockedOn: Date, claimed: Boolean }],
}, { timestamps: true });
export default models.User || model("User", UserSchema);
