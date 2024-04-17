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

/**
 * @openapi
 * /api/v1/signup:
 *   post:
 *     tags:
 *       - "User"
 *     description: "Signup a new user"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               email:
 *                 type: "string"
 *               name:
 *                 type: "string"
 *               phone:
 *                 type: "string"
 *               password:
 *                 type: "string"
 *     responses:
 *       "200":
 *         description: "OTP sent to the phone number"
 */
router.post(
  "/signup",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").isString(),
    check("name", "name is required").isString(),
    check("phone", "phone is required").isString(),
  ],
  signUp
);
/**
 * @openapi
 * /api/v1/verify-otp:
 *   post:
 *     tags:
 *       - User
 *     description: Verify OTP for Sign Up
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User Created Successfully
 */
router.post(
  "/verify-otp",
  [
    check("email", "email is required").isEmail(),
    check("otp", "otp is required").isString(),
  ],
  verifyOtp
);

/**
 * @openapi
 * /api/v1/login:
 *   post:
 *     tags:
 *       - "User"
 *     description: "Login a user"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               email:
 *                 type: "string"
 *               password:
 *                 type: "string"
 *     responses:
 *       "200":
 *         description: "OTP sent to the phone number"
 */
router.post(
  "/login",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").isString(),
  ],
  login
);

/**
 * @openapi
 * /api/v1/verify-login-otp:
 *   post:
 *     tags:
 *       - "User"
 *     description: "Verify OTP for Login"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               email:
 *                 type: "string"
 *               otp:
 *                 type: "string"
 *     responses:
 *       "200":
 *         description: "User Logged In Succesfully"
 */
router.post(
  "/verify-login-otp",
  [
    check("email", "email is required").isEmail(),
    check("otp", "otp is required").isString(),
  ],
  verifyLoginOtp
);

/**
 * @openapi
 * /api/v1/validate-token:
 *   get:
 *     tags:
 *       - "User"
 *     description: "Validate JWT Token"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: "Token is valid"
 */
router.get("/validate-token", verifyToken, validateToken);

/**
 * @openapi
 * /api/v1/profilePic:
 *   get:
 *     tags:
 *       - "User"
 *     description: "Include credentials in the request"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: "Profile Picture"
 */
router.get("/profilePic", verifyToken, getProfilePicture);

/**
 * @openapi
 * /api/v1/profilePic:
 *      get:
 *          tags:
 *              - "User"
 *          description: "Include credentials in the request"
 *          request:
 *            security:
 *                - bearerAuth: []
 *          responses:
 *                  "200":
 *                        description: "Name"
 */
router.get("/name", verifyToken, getName);

export default router;
