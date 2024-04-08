"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true }, // expires in 2 minutes,
    name: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: "2m" } },
    phone: { type: String, required: true },
});
const OTPHolder = mongoose_1.default.model("otp", otpSchema);
exports.default = OTPHolder;
