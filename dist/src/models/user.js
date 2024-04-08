"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    name: { type: String, default: "" },
    phone: { type: String, required: true, unique: true },
});
userSchema.methods.generateToken = function () {
    const token = jsonwebtoken_1.default.sign({ userId: this._id }, process.env.JWT_SECRET_KEY);
    return token;
};
userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = bcryptjs_1.default.hashSync(this.password, 10);
    }
    next();
});
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
