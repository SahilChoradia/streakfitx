import mongoose from "mongoose";
const g = global as any;
const cached = g.mongoose || (g.mongoose = { conn: null, promise: null });
export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Please define the MONGO_URI environment variable");
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(uri, { bufferCommands: false });
  cached.conn = await cached.promise;
  return cached.conn;
}
