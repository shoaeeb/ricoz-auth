import { Request, Response, NextFunction } from "express";
import { CustomApiError } from "../errors";

type CustomErrorType = {
  message: string;
  statusCode: number;
};

interface ErrorType extends Error {
  statusCode: number;
}

const errorMiddleWare = (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customError: CustomErrorType = {
    message: err.message || "Internal Server Error",
    statusCode: err.statusCode || 500,
  };

  if (err instanceof CustomApiError) {
    customError.message = err.message;
    customError.statusCode = err.statusCode;
  }
  console.log(err);
  res.status(customError.statusCode).json({ errors: customError.message });
};

export default errorMiddleWare;
