import dotenv from 'dotenv';
import OpenAI from 'openai';
import Thread from '../models/thread-model.js';

dotenv.config();

const openai = new OpenAI({
    organization: process.env.VITE_OPENAI_ORG_ID,
    project: process.env.VITE_OPENAI_PROJ_ID,
    apiKey: process.env.VITE_OPENAI_API_KEY,
});

export async function runDescriptionStream(value) {
    const thread = await resolveThread('Describer');
    await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: value,
    });

    return openai.beta.threads.runs.stream(thread.id, {
        assistant_id: process.env.VITE_OPENAI_ASSISTANT_ID_DESCRIBER,
    });
}

async function resolveThread(assistantType) {
    const threadDoc = await getOrCreateThread(assistantType);
    return openai.beta.threads.retrieve(threadDoc.threadId);
}

async function getOrCreateThread(assistantType) {
    let thread = await Thread.findOne({ assistantType });
    if (!thread) {
        const newThread = await openai.beta.threads.create();
        thread = new Thread({ threadId: newThread.id, assistantType });
        await thread.save();
    }
    return thread;
}
