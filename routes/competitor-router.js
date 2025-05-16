import express from 'express';
import { deleteCompetitor, getCompetitorById, getCompetitors, createCompetitor, updateCompetitorImage, createCompetitorsBulk } from '../controllers/competitor-controller.js';

const router = express.Router();

router.post('/competitor', createCompetitor)
    .post('/competitor/bulk', createCompetitorsBulk)
    .delete('/competitor/:id', deleteCompetitor)
    .get('/competitor/:id', getCompetitorById)
    .get('/competitors', getCompetitors)
    .put('/competitor/image', updateCompetitorImage);

export default router;