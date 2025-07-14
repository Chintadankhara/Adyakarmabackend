import express from 'express'
import { PORT } from './config/env.js';
import { connectToDb } from './db/connection.js';
import cors from 'cors';
import authRoute from './routes/auth.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import geminiRoute from './routes/gemini.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to ensure database connection before handling requests
app.use(async (req, res, next) => {
    try {
        await connectToDb();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Database connection failed',
            message: 'Unable to connect to database'
        });
    }
});

app.get("/",(req, res)=>{
    res.send("Welcome to api");
})

app.use("/auth", authRoute);
app.use("/ai", geminiRoute);
app.use(errorMiddleware);

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log(`http://localhost:${PORT}`);
        try {
            await connectToDb();
        } catch (error) {
            console.error('Failed to connect to database on startup:', error);
        }
    });
}

export default app;
