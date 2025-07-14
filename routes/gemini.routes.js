import { Router } from "express";
import { aiInterviewQuestion,aiPracticeQuestion} from "../controller/gemini.controller.js";

const geminiRoute = Router();

geminiRoute.post("/aiInterview", aiInterviewQuestion);
geminiRoute.post("/aiPractice", aiPracticeQuestion);

export default geminiRoute;
