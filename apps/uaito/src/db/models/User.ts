import type { Document, Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string,
  apiKey?: string,
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  _id: { type: String, default: () => uuidv4() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Date },
  image: { type: String },
  password: {type: String, required: false},
  apiKey: {type: String, required: false},
  createdAt: { type: Date, default: Date.now }
});

export const UserModel: Model<IUser> = mongoose.models.User || 
    mongoose.model<IUser>('User', UserSchema);

// Example function to create a user
export async function createUser(name: string, email: string, password?: string): Promise<IUser> {
  const user = new UserModel({ name, email, password });
  await user.save();
  return user
}

export async function generateApiKey(email: string) {
  const user = await UserModel.findOne({email});
  if (!user) {
    throw new Error("User not found");
  }
  user.apiKey = `uaito-sk-${crypto.randomBytes(64).toString('hex')}`;
  await user.save();
  return user.apiKey;
}

export async function getApiKey(email: string) {
  const user = await UserModel.findOne({email});
  if (!user) {
    throw new Error("User not found");
  }
  if (user.apiKey) {
    return user.apiKey;
  }
  return generateApiKey(user.email);
}

// Example function to find a user by email
export async function findUserByEmail(email: string): Promise<IUser | null> {
  return await UserModel.findOne({ email });
}