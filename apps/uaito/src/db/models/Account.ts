import type { Document, Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IAccount extends Document {
    userId: string;
    type: 'oauth' | 'email' | 'credentials';
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
}

const AccountSchema: Schema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    refresh_token: { type: String },
    access_token: { type: String },
    expires_at: { type: Number },
    token_type: { type: String },
    scope: { type: String },
    id_token: { type: String },
    session_state: { type: String },
});

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export const AccountModel: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);
