import express from "express";
import { signUp, verifyOtp } from "../controllers/users";
import { check } from "express-validator";

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

export default router;
