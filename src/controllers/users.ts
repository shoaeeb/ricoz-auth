import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../async-wrapper/async-wrapper";
import nodemailer, { SentMessageInfo } from "nodemailer";
import crypto from "crypto";
import { BadRequestError } from "../errors";
import User from "../../models/user";
import OTPHolder from "../../models/otpHolder";
import { validationResult } from "express-validator";

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.email,
    pass: process.env.email_password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const generateOtp = () => {
  const buffer = crypto.randomBytes(3);
  const otp = Math.abs(buffer.readIntLE(0, 3) % 1000000)
    .toString()
    .padStart(6, "0");
  return otp;
};

const signUp = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw new BadRequestError("User already exists");
    }
    const otp = generateOtp();
    let otpHolder = await OTPHolder.findOne({
      email,
    });
    if (otpHolder) {
      res.status(400).json({ error: "OTP already Sent" });
      return;
    }
    otpHolder = new OTPHolder({ email, otp, createdAt: Date.now() });
    await otpHolder.save();

    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "Email Verifiction",
      text: otp,
    };

    transport.sendMail(
      mailOptions,
      (err: Error | null, info: SentMessageInfo) => {
        if (err) {
          console.log(err);
          next(err);
          return;
        } else {
          res
            .status(200)
            .json({ message: `OTP sent to ${email} valid for 2 minutes` });
        }
      }
    );
  }
);

const verifyOtp = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { email, password, otp } = req.body;
    const otpHolder = await OTPHolder.findOne({ email, otp });
    if (!otpHolder) {
      throw new BadRequestError("Invalid OTP");
    }
    await OTPHolder.deleteOne({ email }); // delete the otp after verification
    const user = new User({ email, password });
    await user.save();
    const token = user.generateToken();
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.status(201).json({ message: "User Created Succesfully" });
  }
);

export { signUp, verifyOtp };
