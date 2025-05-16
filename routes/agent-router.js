import express from 'express';
import { runCompetitorGeneration, runDescriptionStream } from '../controllers/agent-controller.js';
import { fuzzySearchCompetitors } from '../controllers/competitor-controller.js';

const router = express.Router();

router.post('/streamDescription', async (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    const { value } = req.body;

    try {
        const stream = await runDescriptionStream(value);

        for await (const chunk of stream) {
            const content = chunk.data?.delta?.content[0]?.text.value;
            if (content) {
                res.write(content);
            }
        }

        res.end();
    } catch (err) {
        console.error('Streaming error:', err);
        res.status(500).end('Error during streaming');
    }
});

router.post('/generateCompetitors', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    const { value } = req.body;

    try {
        res.write(JSON.stringify({ step: 0, totalSteps: 2, data: [] }) + '\n');

        const output = await runCompetitorGeneration(value.toString());

        res.write(JSON.stringify({ step: 1, totalSteps: 2, data: [] }) + '\n');

        const competitors = JSON.parse(output);
        const updatedCompetitors = await Promise.all(
            competitors.map(async (comp) => {
                const matched = await fuzzySearchCompetitors(comp.name);
                return {
                    ...comp,
                    competitorName: comp.name,
                    matchedCompetitor: matched[0]?.name || null,
                };
            })
        );

        res.write(JSON.stringify({ step: 2, totalSteps: 2, data: updatedCompetitors }) + '\n');

        res.end();
    } catch (err) {
        console.error('Streaming error:', err);
        res.status(500).end('Error during streaming');
    }
});

export default router;