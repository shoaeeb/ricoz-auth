"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.BadRequestError = exports.CustomApiError = void 0;
const CustomAPIError_1 = __importDefault(require("./CustomAPIError"));
exports.CustomApiError = CustomAPIError_1.default;
const BadRequestError_1 = __importDefault(require("./BadRequestError"));
exports.BadRequestError = BadRequestError_1.default;
const UnauthorizedError_1 = __importDefault(require("./UnauthorizedError"));
exports.UnauthorizedError = UnauthorizedError_1.default;
