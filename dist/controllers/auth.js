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
exports.passport = exports.validateToken = exports.verifyLoginOtp = exports.login = void 0;
const async_wrapper_1 = __importDefault(require("../async-wrapper/async-wrapper"));
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const errors_1 = require("../errors");
const utils_1 = require("../utils/utils");
const otpHolder_1 = __importDefault(require("../models/otpHolder"));
const login = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user) {
        throw new errors_1.BadRequestError("Wrong Credentials");
    }
    const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new errors_1.BadRequestError("Invalid Credentials");
    }
    let phone = user.phone;
    const otp = (0, utils_1.generateOtp)();
    yield otpHolder_1.default.deleteMany({ email });
    const otpHolder = new otpHolder_1.default({
        email,
        otp,
        password: user.password,
        phone: user.phone,
        name: user.name,
        createdAt: new Date(),
    });
    yield otpHolder.save();
    phone = phone.replace("+", "");
    const message = yield fetch(`https://smsgw.tatatel.co.in:9095/campaignService/campaigns/qs?dr=false&sender=FRICOZ&recipient=${phone}&msg=Dear Customer, Your OTP for mobile number verification is ${otp}. Please do not share this OTP to anyone - Firstricoz Pvt. Ltd.&user=FIRSTR&pswd=First^01&PE_ID=1601832170235925649&Template_ID=1607100000000306120`);
    const response = yield message.json();
    res.status(200).json({ message: `OTP sent sent to your phone ${phone} ` });
}));
exports.login = login;
const verifyLoginOtp = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array() });
        return;
    }
    const { email, otp } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user) {
        throw new errors_1.BadRequestError("Invalid Credentails");
    }
    const otpHolder = yield otpHolder_1.default.findOne({ email });
    if (!otpHolder) {
        throw new errors_1.BadRequestError("Invalid OTP");
    }
    const token = user.generateToken();
    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1day
    });
    res.status(200).json({ message: "User Signed In" });
}));
exports.verifyLoginOtp = verifyLoginOtp;
const validateToken = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: req.userId });
}));
exports.validateToken = validateToken;
