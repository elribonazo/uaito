import  mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITool extends Document {
    userId: string,
    threadId: string,
    name: string,
    content: string,
    input: string,
    state: string,
    error: boolean
}

const ToolSchema: Schema = new Schema({
    userId: {type: String, required: true},
    threadId: {type: String, required: true},
    content: {type: String},
    input: {type: String, required: true},
    state: {type: String, required: true},
    name: {type: String, required: true},
    error: {type: Boolean, default: false},
});

export const ToolModel: Model<ITool> = mongoose.models.Tool || mongoose.model<ITool>(
    'Tool', 
    ToolSchema
)