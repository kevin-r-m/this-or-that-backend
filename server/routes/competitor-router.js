import express from 'express';
import { deleteCompetitor, getCompetitorById, getCompetitors, createCompetitor } from '../controllers/competitor-controller.js';

const router = express.Router();

router.post('/competitor', createCompetitor)
    .delete('/competitor/:id', deleteCompetitor)
    .get('/competitor/:id', getCompetitorById)
    .get('/competitors', getCompetitors)

export default router;