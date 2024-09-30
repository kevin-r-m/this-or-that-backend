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
import { createCompetiton, getCompetitonAndSetWinner } from './controllers/competition-controller.js';

const app = express();
const apiPort = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(checkApiKey);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', competitionRouter);
app.use('/api', competitorRouter);

async function handleNewCompetition() {
    await getCompetitonAndSetWinner();
    createCompetiton();
}

cron.schedule("0 0 * * *", () => handleNewCompetition());

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));