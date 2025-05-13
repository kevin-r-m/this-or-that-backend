import express from 'express';
import { runDescriptionStream } from '../controllers/agent-controller.js';

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

export default router;