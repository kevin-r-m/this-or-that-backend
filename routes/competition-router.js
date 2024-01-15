import express from 'express';
import { getCompetition } from '../controllers/competition-controller.js';

const router = express.Router();

router.get('/competition', getCompetition); // Assuming this is a POST request to create a competition

export default router;

