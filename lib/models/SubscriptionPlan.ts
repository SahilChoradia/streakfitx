import { Schema, models, model } from "mongoose";
const S = new Schema({ name: { type: String, required: true }, price: { type: Number, required: true }, durationMonths: { type: Number, default: 1 }, features: [String], badge: String }, { timestamps: true });
export default models.SubscriptionPlan || model("SubscriptionPlan", S);
