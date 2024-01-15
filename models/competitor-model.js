/**
 * @file Defines the Competitor model.
 */

import mongoose from "mongoose";
const Schema = mongoose.Schema

const Competitor = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        wins: {type: Number, required: true},
        losses: {type: Number, required: true},
        totalVotes: {type: Number, required: true}
    },
    { timestamps: true },
);

export default mongoose.model('competitor', Competitor);