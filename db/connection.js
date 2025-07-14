import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

export const connectToDb = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Mongodb connected to ${NODE_ENV} mode`)
    } catch (error) {
        console.log('Error connect to mongodb', error)
    }
}