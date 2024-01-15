/**
 * @file This file contains the controller functions for managing competitions.
 * @description Contains functions for handling competition-related operations.
 */

import Competitor from '../models/competitor-model.js';
import Competition from '../models/competiton-model.js';

/**
 * @description Creates a new competition by randomly selecting two competitors from the database.
 */
const createCompetiton = () => {
    Competitor.aggregate([{$sample: {size: 2}}])
        .then((competitors) => {

            const competitionObj = {
                competitorOne: {
                    id: competitors[0]._id,
                    name: competitors[0].name,
                    image: competitors[0].image,
                    votes: 0,
                    winner: false,
                },
                competitorTwo: {
                    id: competitors[1]._id,
                    name: competitors[1].name,
                    image: competitors[1].image,
                    votes: 0,
                    winner: false,
                },
                totalVotes: 0,
            }

            Competition.create(competitionObj, (err, competition) => {
                if (err) {
                    console.error(err)
                }
                console.log(competition)
            })
        })
}

/**
 * @description Retrieves the latest competition from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getCompetition = (req, res) => {
    console.log("made it to get competition")
    Competition.find({}).sort({createdAt: 1}).limit(1)
        .then(competition => {
            return res.status(200).json({success: true, data: competition})
        })
        .catch(err => {
            return res.status(400).json({success: false, error: err})
        });
}

export {
    createCompetiton,
    getCompetition,
}