import dotenv from 'dotenv';

dotenv.config();

export default function checkApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: "Invalid API key" });
    }

    next();

}