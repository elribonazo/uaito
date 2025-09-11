import type { Document, Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IVerificationToken extends Document {
    identifier: string;
    token: string;
    expires: Date;
}

const VerificationTokenSchema: Schema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    identifier: { type: String },
    token: { type: String, unique: true },
    expires: { type: Date },
});

VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

export const VerificationTokenModel: Model<IVerificationToken> = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema);
