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
    const auth_token = req.cookies["auth_token"];
    if (!auth_token) {
      throw new UnauthorizedError("Unauthorized");
    }
    const decoded = jwt.verify(
      auth_token,
      process.env.JWT_SECRET_KEY as string
    );
    const userId = (decoded as JwtPayload).userId;
    req.userId = userId;
    next();
  }
);

export { verifyToken };
