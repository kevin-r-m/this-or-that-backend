import express from 'express';
import { getCompetition, getYesterdaysCompetition, updateCompetition, getAllCompetitions } from '../controllers/competition-controller.js';

const router = express.Router();

router.get('/competition', getCompetition);
router.get('/competition/yesterday', getYesterdaysCompetition);
router.get('/competitions', getAllCompetitions);
router.put('/competition', updateCompetition);

export default router;

