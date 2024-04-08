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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const async_wrapper_1 = __importDefault(require("../async-wrapper/async-wrapper"));
const errors_1 = require("../errors");
const verifyToken = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth_token = req.cookies["auth_token"];
    if (!auth_token) {
        throw new errors_1.UnauthorizedError("Unauthorized");
    }
    const decoded = jsonwebtoken_1.default.verify(auth_token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
    req.userId = userId;
    next();
}));
exports.verifyToken = verifyToken;
