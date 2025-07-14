import { config } from 'dotenv';

config({ path: `.env.development` });

export const {
    PORT, 
    NODE_ENV,
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    GEMINI_API_KEY,
} = process.env