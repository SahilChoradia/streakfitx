import { Schema, models, model } from "mongoose";
const S = new Schema({ name: String, email: String, subject: String, message: String, status: { type: String, enum: ["new", "read", "replied"], default: "new" } }, { timestamps: true });
export default models.ContactMessage || model("ContactMessage", S);
