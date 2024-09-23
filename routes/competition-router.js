import express from 'express';
import { getCompetition, getYesterdaysCompetition, updateCompetition } from '../controllers/competition-controller.js';

const router = express.Router();

router.get('/competition', getCompetition);
router.get('/competition/yesterday', getYesterdaysCompetition);
router.put('/competition', updateCompetition);

export default router;

