import { Router } from "express";
import {
  signIn,
  signUp,
  authorize,
  isvalidemail,
  resetPassword,
} from "../controller/auth.controller.js";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/signin", signIn);
authRoute.post("/tokencheck", authorize);
authRoute.post("/isvalidmail", isvalidemail);
authRoute.post("/resetpassword", resetPassword);

export default authRoute;
