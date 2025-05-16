import dotenv from 'dotenv';
import OpenAI from 'openai';
import Thread from '../models/thread-model.js';

dotenv.config();

const openai = new OpenAI({
    organization: process.env.OPENAI_ORG_ID,
    project: process.env.OPENAI_PROJ_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

export async function runDescriptionStream(value) {
    const thread = await resolveThread('Describer');
    await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: value,
    });

    return openai.beta.threads.runs.stream(thread.id, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID_DESCRIBER,
    });
}

export async function runCompetitorGeneration(numberOfCompetitors) {
    const thread = await resolveThread('Generator');

    await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: numberOfCompetitors,
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID_GENERATOR,
    });

    if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id);

        const assistantMessagesForRun = messages.data.find(msg =>
            msg.role === 'assistant' && msg.run_id === run.id
        );

        return assistantMessagesForRun.content[0].text.value;
    }
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
