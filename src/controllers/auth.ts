import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../async-wrapper/async-wrapper";
import { validationResult } from "express-validator";
import { SentMessageInfo } from "nodemailer";
import passport from "passport";
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
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Wrong Credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestError("Invalid Credentials");
    }
    let phone = user.phone;
    const otp = generateOtp();
    await OTPHolder.deleteMany({ email });

    const otpHolder = new OTPHolder({
      email,
      otp,
      password: user.password,
      phone: user.phone,
      name: user.name,
      createdAt: new Date(),
    });
    await otpHolder.save();
    phone = phone.replace("+", "");
    const message = await fetch(
      `https://smsgw.tatatel.co.in:9095/campaignService/campaigns/qs?dr=false&sender=FRICOZ&recipient=${phone}&msg=Dear Customer, Your OTP for mobile number verification is ${otp}. Please do not share this OTP to anyone - Firstricoz Pvt. Ltd.&user=FIRSTR&pswd=First^01&PE_ID=1601832170235925649&Template_ID=1607100000000306120`
    );

    const response = {
      statusCode: 200,
      success: true,
      message: "OTP sent to your phone number",
      data: {
        user,
      },
    };

    res.status(200).json(response);
  }
);

const verifyLoginOtp = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
      return;
    }
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid Credentails");
    }

    const otpHolder = await OTPHolder.findOne({ email });
    if (!otpHolder) {
      throw new BadRequestError("Invalid OTP");
    }
    const token = user.generateToken();

    const response = {
      statusCode: "200",
      success: true,
      message: "OTP verified successfully",
      data: {
        data: {
          user,
        },
        token,
      },
    };

    res.status(200).json(response);
  }
);

const validateToken = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: req.userId });
  }
);

export { login, verifyLoginOtp, validateToken, passport };
