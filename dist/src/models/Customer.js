"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    salutation: {
        type: String,
        required: true,
        enum: {
            values: ["Mr", "Mrs", "Ms", "Dr"],
            message: "{VALUE} is not supported",
        },
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, required: true },
    companyDisplayName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    customerType: { type: String, required: true },
});
const Customer = mongoose_1.default.model("Customer", customerSchema);
exports.default = Customer;
