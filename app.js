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

app.get("/",(req, res)=>{
    res.send("Welcome to api");
})

app.use("/auth", authRoute);
app.use("/ai", geminiRoute);
app.use(errorMiddleware);


app.listen(PORT, async () => {
    console.log(`http://localhost:${PORT}`);
    await connectToDb();
})
