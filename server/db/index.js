/**
 * @file This file is responsible for establishing a connection to the MongoDB database using Mongoose.
 */

import mongoose from "mongoose";
import dotenv from 'dotenv';

// Need to call dotenv.config() here because process.env.MONGO_URI is undefined otherwise
dotenv.config();

mongoose
    .connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

export default db;