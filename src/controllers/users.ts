import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../async-wrapper/async-wrapper";
import { SentMessageInfo } from "nodemailer";
import { BadRequestError } from "../errors";
import User from "../models/user";
import OTPHolder from "../models/otpHolder";
import { validationResult } from "express-validator";
import { transport, generateOtp } from "../utils/utils";
import fetch from "node-fetch";

const signUp = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors
          .array()
          .map((error: any) => error.path + " " + error.msg),
      });
      return;
    }
    const { email, password, name } = req.body;

    let { phone } = req.body;
    phone = phone.replace("+", "");

    const user = await User.findOne({ email, phone });
    if (user) {
      throw new BadRequestError("User already exists");
    }
    const otp = generateOtp();
    let otpHolder = await OTPHolder.findOne({
      email,
    });
    if (otpHolder) {
      await OTPHolder.deleteOne({ email });
    }
    otpHolder = new OTPHolder({
      email,
      otp,
      name,
      password,
      createdAt: Date.now(),
      phone,
    });
    await otpHolder.save();

    const message = await fetch(
      `https://smsgw.tatatel.co.in:9095/campaignService/campaigns/qs?dr=false&sender=FRICOZ&recipient=${phone}&msg=Dear Customer, Your OTP for mobile number verification is ${otp}. Please do not share this OTP to anyone - Firstricoz Pvt. Ltd.&user=FIRSTR&pswd=First^01&PE_ID=1601832170235925649&Template_ID=1607100000000306120`
    );

    const response = {
      statusCode: "200",
      success: true,
      message: "OTP sent to your phone number",
      data: {
        phoneNumber: phone,
        otp,
      },
    };

    res.status(200).json(response);
  }
);

const verifyOtp = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { email, otp } = req.body;
    const otpHolder = await OTPHolder.findOne({ email, otp });
    if (!otpHolder) {
      throw new BadRequestError("Invalid OTP");
    }
    const name = otpHolder.name;
    const password = otpHolder.password;
    const phone = otpHolder.phone;
    const user = new User({ email, password, name, phone });
    await user.save();
    await OTPHolder.deleteOne({ email }); // delete the otp after verification

    const token = user.generateToken();
    const response = {
      statusCode: "201",
      success: true,
      message: "OTP verified successfully",
      data: {
        data: {
          user,
        },
        token,
      },
    };

    res.status(201).json(response);
  }
);

const getProfilePicture = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const response = {
      success: true,
      message: "Profile Picture Fetched Successfully",
      statusCode: "200",
      data: {
        profilePic: user.profilePic,
      },
    };
    res.status(200).json(response);
  }
);

const getName = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const response = {
      success: true,
      message: "Name Fetched Successfully",
      statusCode: "200",
      data: {
        name: user.name,
      },
    };
    res.status(200).json(response);
  }
);

export { signUp, verifyOtp, getProfilePicture, getName };
