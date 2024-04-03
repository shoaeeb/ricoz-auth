import express from "express";
import {
  getName,
  getProfilePicture,
  signUp,
  verifyOtp,
} from "../controllers/users";
import { login, validateToken, verifyLoginOtp } from "../controllers/auth";
import { check } from "express-validator";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/signup",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").isString(),
  ],
  signUp
);
router.post(
  "/verify-otp",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").isString(),
    check("otp", "otp is required").isString(),
  ],
  verifyOtp
);

router.post(
  "/login",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").isString(),
  ],
  login
);
router.post(
  "/verify-login-otp",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").isString(),
    check("otp", "otp is required").isString(),
  ],
  verifyLoginOtp
);

router.get("/validate-token", verifyToken, validateToken);
router.get("/profilePic", verifyToken, getProfilePicture);
router.get("/name", verifyToken, getName);

export default router;
