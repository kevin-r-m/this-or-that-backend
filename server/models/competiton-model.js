/**
 * @file Defines the Competition model.
 */

import mongoose from "mongoose";
const Schema = mongoose.Schema

const Competition = new Schema(
    {
        competitiorOne: {
            id: {
                type: mongoose.Schema.Types.ObjectId
            },
            name: {
                type: String
            },
            image: {
                type: String
            },
            votes: {
                type: Number
            },
            winner: {
                type: Boolean
            }
        },
        competitorTwo: {
            id: {
                type: mongoose.Schema.Types.ObjectId
            },
            name: {
                type: String
            },
            image: {
                type: String
            },
            votes: {
                type: Number
            },
            winner: {
                type: Boolean
            }
        },
        totalVotes: {
            type: Number
        }
    },
    {timestamps: true}
);

export default mongoose.model('competition', Competition);