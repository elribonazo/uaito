import type { Document, Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ISession extends Document {
    sessionToken: string;
    userId: string;
    expires: Date;
}

const SessionSchema: Schema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    sessionToken: { type: String, unique: true },
    userId: { type: String },
    expires: { type: Date },
});

export const SessionModel: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
