"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = exports.generateOtp = exports.transport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const transport = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.email,
        pass: process.env.email_password,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
exports.transport = transport;
const generateOtp = () => {
    const buffer = crypto_1.default.randomBytes(3);
    const otp = Math.abs(buffer.readIntLE(0, 3) % 1000000)
        .toString()
        .padStart(6, "0");
    return otp;
};
exports.generateOtp = generateOtp;
function generatePassword() {
    return crypto_1.default.randomBytes(20).toString("hex");
}
exports.generatePassword = generatePassword;
