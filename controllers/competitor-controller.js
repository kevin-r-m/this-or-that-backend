/**
 * @file Competitor Controller
 * @description Contains functions for handling competitor-related operations.
 */

import Competitor from '../models/competitor-model.js';

/**
 * @description Create a new competitor.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
const createCompetitor = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a competitor',
        })
    }

    const competitor = new Competitor(body)

    if (!competitor) {
        return res.status(400).json({ success: false, error: err })
    }

    competitor
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: competitor._id,
                message: 'Competitor created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Competitor not created!',
            })
        })
}

/**
 * @description Delete a competitor by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
const deleteCompetitor = async (req, res) => {
    await Competitor.findOneAndDelete({ _id: req.params.id }, (err, competitor) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!competitor) {
            return res
                .status(404)
                .json({ success: false, error: `Competitor not found` })
        }

        return res.status(200).json({ success: true, data: competitor })
    }).catch(err => console.log(err))
}

/**
 * @description Get a competitor by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
const getCompetitorById = async (req, res) => {
    await Competitor.findOne({ _id: req.params.id }, (err, competitor) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!competitor) {
            return res
                .status(404)
                .json({ success: false, error: `Competitor not found` })
        }
        return res.status(200).json({ success: true, data: competitor })
    }).catch(err => console.log(err))
}

/**
 * @description Get all competitors.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
const getCompetitors = async (req, res) => {
    await Competitor.find({}, (err, competitors) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!competitors.length) {
            return res
                .status(404)
                .json({ success: false, error: `Competitor not found` })
        }
        return res.status(200).json({ success: true, data: competitors })
    }).clone().catch(err => console.log(err))
}

export {
    createCompetitor,
    deleteCompetitor,
    getCompetitors,
    getCompetitorById,
}