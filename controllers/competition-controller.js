/**
 * @file This file contains the controller functions for managing competitions.
 * @description Contains functions for handling competition-related operations.
 */

import Competitor from '../models/competitor-model.js';
import Competition from '../models/competiton-model.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const SIMULATE_USERS = process.env.SIMULATE_USERS;


/**
 * @description Creates a new competition by randomly selecting two competitors from the database.
 */
const createCompetiton = () => {
    Competitor.aggregate([{ $sample: { size: 2 } }])
        .then((competitors) => {

            const competitorOneVotes = SIMULATE_USERS ? Math.floor(Math.random() * 100) : 0;
            const competitorTwoVotes = SIMULATE_USERS ? Math.floor(Math.random() * 100) : 0;
            const totalVotes = competitorOneVotes + competitorTwoVotes;

            const competitionObj = {
                competitorOne: {
                    id: competitors[0]._id,
                    name: competitors[0].name,
                    image: competitors[0].image,
                    votes: competitorOneVotes,
                    winner: false,
                },
                competitorTwo: {
                    id: competitors[1]._id,
                    name: competitors[1].name,
                    image: competitors[1].image,
                    votes: competitorTwoVotes,
                    winner: false,
                },
                totalVotes: totalVotes,
            }

            Competition.create(competitionObj, (err) => {
                if (err) {
                    console.error(err)
                }
            })
        })
}

function getCompetitonAndSetWinner() {
    Competition.find({}).sort({ createdAt: -1 }).limit(1)
        .then(competitionData => {
            const competition = competitionData[0];

            if (competition.competitorOne.votes === competition.competitorTwo.votes) {
                competition.competitorOne.winner = false;
                competition.competitorTwo.winner = false;
                return competition.save();
            }

            if (competition.competitorOne.votes > competition.competitorTwo.votes) {
                competition.competitorOne.winner = true;
            } else {
                competition.competitorTwo.winner = true;
            }


            return competition.save();
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * @description Retrieves the latest competition from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getCompetition = (req, res) => {
    Competition.find({}).sort({ createdAt: -1 }).limit(1)
        .then(competition => {
            return res.status(200).json({ success: true, data: competition })
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
        });
}

const updateCompetition = (req, res) => {
    const { data } = req.body;

    if (!data || !data.competitionID || !data.competitorID) {
        return res.status(400).json({ success: false, error: 'Invalid request data' });
    }

    Competition.findById(data.competitionID)
        .then(competition => {
            if (!competition) {
                return res.status(404).json({ success: false, error: 'Competition not found' });
            }

            const newCompetitionVotes = competition.totalVotes + 1;
            competition.totalVotes = newCompetitionVotes;

            const competitorObjectId = mongoose.Types.ObjectId(data.competitorID);

            if (competitorObjectId.equals(competition.competitorOne.id)) {
                competition.competitorOne.votes += 1;
            } else if (competitorObjectId.equals(competition.competitorTwo.id)) {
                competition.competitorTwo.votes += 1;
            }

            return competition.save();
        })
}

const getYesterdaysCompetition = (req, res) => {
    Competition.find({}).sort({ createdAt: -1 }).skip(1).limit(1)
        .then(competition => {
            return res.status(200).json({ success: true, data: competition })
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
        });
}

export {
    createCompetiton,
    getCompetitonAndSetWinner,
    getCompetition,
    updateCompetition,
    getYesterdaysCompetition
}