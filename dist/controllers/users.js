"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getName = exports.getProfilePicture = exports.verifyOtp = exports.signUp = void 0;
const async_wrapper_1 = __importDefault(require("../async-wrapper/async-wrapper"));
const errors_1 = require("../errors");
const user_1 = __importDefault(require("../models/user"));
const otpHolder_1 = __importDefault(require("../models/otpHolder"));
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils/utils");
const node_fetch_1 = __importDefault(require("node-fetch"));
const signUp = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors
                .array()
                .map((error) => error.path + " " + error.msg),
        });
        return;
    }
    const { email, password, name } = req.body;
    let { phone } = req.body;
    phone = phone.replace("+", "");
    const user = yield user_1.default.findOne({ email, phone });
    if (user) {
        throw new errors_1.BadRequestError("User already exists");
    }
    const otp = (0, utils_1.generateOtp)();
    let otpHolder = yield otpHolder_1.default.findOne({
        email,
    });
    if (otpHolder) {
        yield otpHolder_1.default.deleteOne({ email });
    }
    otpHolder = new otpHolder_1.default({
        email,
        otp,
        name,
        password,
        createdAt: Date.now(),
        phone,
    });
    yield otpHolder.save();
    const message = yield (0, node_fetch_1.default)(`https://smsgw.tatatel.co.in:9095/campaignService/campaigns/qs?dr=false&sender=FRICOZ&recipient=${phone}&msg=Dear Customer, Your OTP for mobile number verification is ${otp}. Please do not share this OTP to anyone - Firstricoz Pvt. Ltd.&user=FIRSTR&pswd=First^01&PE_ID=1601832170235925649&Template_ID=1607100000000306120`);
    const response = yield message.json();
    console.log(response);
    res.status(200).json({ message: `OTP sent sent to your phone ${phone} ` });
}));
exports.signUp = signUp;
const verifyOtp = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, otp } = req.body;
    const otpHolder = yield otpHolder_1.default.findOne({ email, otp });
    if (!otpHolder) {
        throw new errors_1.BadRequestError("Invalid OTP");
    }
    const name = otpHolder.name;
    const password = otpHolder.password;
    const phone = otpHolder.phone;
    const user = new user_1.default({ email, password, name, phone });
    yield user.save();
    yield otpHolder_1.default.deleteOne({ email }); // delete the otp after verification
    const token = user.generateToken();
    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24,
    });
    res.status(201).json({ message: "User Created Succesfully" });
}));
exports.verifyOtp = verifyOtp;
const getProfilePicture = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.userId);
    if (!user) {
        throw new errors_1.BadRequestError("User not found");
    }
    res.status(200).json({ message: user.profilePic });
}));
exports.getProfilePicture = getProfilePicture;
const getName = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.userId);
    if (!user) {
        throw new errors_1.BadRequestError("User not found");
    }
    res.status(200).json({
        messsage: user.name,
    });
}));
exports.getName = getName;
