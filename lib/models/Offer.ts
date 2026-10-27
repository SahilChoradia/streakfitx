import { Schema, models, model } from "mongoose";
const S = new Schema({ title: { type: String, required: true }, description: String, requiredStreak: { type: Number, default: 7 },
  category: { type: String, enum: ["merchandise", "supplement", "discount", "service"], default: "discount" }, code: String, expiryDate: Date }, { timestamps: true });
export default models.Offer || model("Offer", S);
