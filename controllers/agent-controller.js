import dotenv from 'dotenv';
import OpenAI from 'openai';
import Thread from '../models/thread-model.js';

dotenv.config();

const openai = new OpenAI({
    organization: process.env.VITE_OPENAI_ORG_ID,
    project: process.env.VITE_OPENAI_PROJ_ID,
    apiKey: process.env.VITE_OPENAI_API_KEY,
});

async function resolveThread() {
    const threadDoc = await getOrCreateThread();
    return openai.beta.threads.retrieve(threadDoc.threadId);
}

async function getOrCreateThread() {
    let thread = await Thread.findOne();
    if (!thread) {
        const newThread = await openai.beta.threads.create();
        thread = new Thread({ threadId: newThread.id });
        await thread.save();
    }
    return thread;
}

export async function runDescriptionStream(value) {
    const thread = await resolveThread();
    await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: value,
    });

    return openai.beta.threads.runs.stream(thread.id, {
        assistant_id: process.env.VITE_OPENAI_ASSISTANT_ID,
    });
}
