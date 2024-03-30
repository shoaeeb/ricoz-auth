import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../async-wrapper/async-wrapper";
import { validationResult } from "express-validator";
import { SentMessageInfo } from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { BadRequestError } from "../errors";
import { transport, generateOtp } from "../utils/utils";
import OTPHolder from "../models/otpHolder";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { email, password } = req.body;
    const user = User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Wrong Credentials");
    }
    const otp = generateOtp();
    await OTPHolder.deleteMany({ email });

    const otpHolder = new OTPHolder({
      email,
      otp,
    });
    await otpHolder.save();
    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "OTP for sign in",
      text: `${otp} valid for 2 minutes`,
    };
    transport.sendMail(
      mailOptions,
      (err: Error | null, info: SentMessageInfo) => {
        if (err) {
          console.log(err);
          next(err);
          return;
        } else {
          res.status(200).json({ message: `OTP sent to ${email}` });
        }
      }
    );
  }
);

const verifyLoginOtp = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
      return;
    }
    const { email, password, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid Credentails");
    }

    const otpHolder = await OTPHolder.findOne({ email });
    if (!otpHolder) {
      throw new BadRequestError("Invalid OTP");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestError("Invalid Credentials");
    }
    const token = user.generateToken();
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1day
    });

    res.status(200).json({ message: "User Signed In" });
  }
);

const validateToken = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: req.userId });
  }
);

export { login, verifyLoginOtp, validateToken };
