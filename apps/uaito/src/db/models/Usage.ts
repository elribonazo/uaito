
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IUsage extends Document {
  userId: string,
  input: number,
  output: number,
  threadId: string,
  createdAt: Date,
}

const UsageSchema: Schema = new Schema({
  userId: { type: String, required: true },
  input: { type: Number, required: true },
  output: { type: Number, required: true },
  threadId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() }
})

export const UsageModel: Model<IUsage> =
  mongoose.models.Usage ||
  mongoose.model<IUsage>('Usage', UsageSchema);

export async function createUsage(
  user: IUser,
  threadId: string,
  input?: number,
  output?: number
): Promise<IUsage> {

  const usage = await UsageModel.findOne({ threadId: threadId });
  if (usage) {
    usage.output += output ?? 0;
    usage.input += input ?? 0;
    await usage.save()
    return usage
  } else {
    const newUsage =  new UsageModel({ 
      threadId: threadId, 
      userId: user.id, 
      input: input ?? 0,
      output: output ?? 0
    })
    await newUsage.save();
    return newUsage
  }
}