import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncWrapper from "../async-wrapper/async-wrapper";
import { UnauthorizedError } from "../errors";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token is missing");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  }
);

export { verifyToken };
