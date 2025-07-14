import { Router } from "express";
import { signIn, signUp, authorize } from "../controller/auth.controller.js";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/signin", signIn);
authRoute.post("/tokencheck",authorize);

export default authRoute