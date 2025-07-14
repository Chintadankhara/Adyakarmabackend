import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import nodemailer from 'nodemailer';

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        //Data from form body
        const { name, email, password } = req.body;

        ///Find user by it's email
        const userExist = await User.findOne({ email });

        //Check if user already exist
        if (userExist) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }
        //Hashing an user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Creatig new user
        const newUser = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session });

        //Generating jwt token
        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        session.endSession();

        //Sending success message on behalf of user creation
        res.status(201).json({ success: true, message: "User created successfully", data: { token, user: newUser[0] } })
    } catch (error) {
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        //Data from form body
        const { email, password } = req.body;

        //Finding user by it's email
        const user = await User.findOne({ email });

        //Check if user is exists or not
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        //Compare form  password with user password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        //If password is not same then,
        if (!isPasswordMatch) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        //Creating token for user
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        //Sending success message to user on behalf of user login successfully
        res.status(200).json({ success: true, message: "User signed in successfully", data: { token, user } })

    } catch (error) {
        next(error)
    }
}

export const authorize = async (req, res, next) => {
    try {
        //Taking token from user
        const { token } = req.body;

        //Decoding user token
        const decoded = jwt.verify(token, JWT_SECRET);

        //Finding user
        const user = await User.findOne({ _id: decoded.userId });

        //If user not exists
        if (!user) {

            const error = new Error("User not exists");
            error.statusCode = 404;
            throw error;
        }

        //Sending success message to user if exists
        res.status(200).json({ success: true, message: "User is exists" });

    } catch (error) {
        next(error);
    }
}


export const isvalidemail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isexist = await User.findOne({ email });
    if (!isexist) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "chintandankhara10@gmail.com",
        pass: "ocuf kdbk fsge uxbo",
      },
    });

    function sendMail(to, subject, message) {
      transporter.sendMail({
        to,
        subject,
        html: message,
      });
    }
    const OTP = Math.floor(1000 + Math.random() * 9000);

    sendMail(
      email,
      "OTP for password reset in scheme of gujarat",
      `<h2>${OTP}</h2>`
    );

    res.status(200).json({ success: true, otp: OTP, email: email });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    //Hashing a new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //Updating new password
    user.password = hashedPassword;
    await user.save();
    res
      .status(500)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error updating password" });
    next(error);
  }
};

