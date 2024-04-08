"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const errorMiddleWare = (err, req, res, next) => {
    const customError = {
        message: err.message || "Internal Server Error",
        statusCode: err.statusCode || 500,
    };
    if (err instanceof errors_1.CustomApiError) {
        customError.message = err.message;
        customError.statusCode = err.statusCode;
    }
    console.log(err);
    res.status(customError.statusCode).json({ errors: customError.message });
};
exports.default = errorMiddleWare;
