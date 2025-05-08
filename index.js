/**
 * @file This is the main server file for the ThisOrThat backend.
 * @description It sets up an Express server, connects to MongoDB, and defines routes and controllers.
 */

import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

import db from './db/index.js';
import checkApiKey from './utils/middleware.js';
import competitionRouter from './routes/competition-router.js';
import competitorRouter from './routes/competitor-router.js';
import { createNewCompetition, reconcileCurrentCompetition } from './controllers/competition-controller.js';

const app = express();
const API_PORT = process.env.PORT || 8000;
const API_ENDPOINT = '/api';

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(checkApiKey);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(API_ENDPOINT, competitionRouter);
app.use(API_ENDPOINT, competitorRouter);

async function rotateDailyCompetition() {
    await reconcileCurrentCompetition();
    createNewCompetition();
}

cron.schedule("0 0 * * *", () => rotateDailyCompetition());

app.listen(API_PORT, () => console.log(`Server running on port ${API_PORT}`));