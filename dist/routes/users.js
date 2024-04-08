"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const auth_1 = require("../controllers/auth");
const express_validator_1 = require("express-validator");
const auth_2 = require("../middlewares/auth");
const router = express_1.default.Router();
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
router.post("/signup", [
    (0, express_validator_1.check)("email", "email is required").isEmail(),
    (0, express_validator_1.check)("password", "password is required").isString(),
    (0, express_validator_1.check)("name", "name is required").isString(),
    (0, express_validator_1.check)("phone", "phone is required").isString(),
], users_1.signUp);
/**
 * @openapi
 * /api/v1/verify-otp:
 *    post:
 *      tags:
 *         - "User"
 *      description: "Verify OTP for Sign Up"
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                type: "object"
 *                properties:
 *                  email:
 *                    type:"string"
 *                  otp:
 *                    type:"string"
 *      responses:
 *               "201":
 *                  description: "User Created Succesfully"
 */
router.post("/verify-otp", [
    (0, express_validator_1.check)("email", "email is required").isEmail(),
    (0, express_validator_1.check)("otp", "otp is required").isString(),
], users_1.verifyOtp);
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
router.post("/login", [
    (0, express_validator_1.check)("email", "email is required").isEmail(),
    (0, express_validator_1.check)("password", "password is required").isString(),
], auth_1.login);
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
router.post("/verify-login-otp", [
    (0, express_validator_1.check)("email", "email is required").isEmail(),
    (0, express_validator_1.check)("otp", "otp is required").isString(),
], auth_1.verifyLoginOtp);
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
router.get("/validate-token", auth_2.verifyToken, auth_1.validateToken);
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
router.get("/profilePic", auth_2.verifyToken, users_1.getProfilePicture);
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
router.get("/name", auth_2.verifyToken, users_1.getName);
exports.default = router;
