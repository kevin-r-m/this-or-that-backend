/**
 * @file Defines the Thread model.
 */

import mongoose from "mongoose";
const Schema = mongoose.Schema

const Thread = new Schema(
    {
        threadId: { type: String, required: true },
        assistantType: {
            type: String,
            enum: ['Describer', 'Generator'],
            required: true
        },
    },
    { timestamps: true, expireAfterSeconds: 2592000 },
);

export default mongoose.model('thread', Thread);