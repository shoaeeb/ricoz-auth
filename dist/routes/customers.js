"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customers_1 = require("../controllers/customers");
const auth_1 = require("../middlewares/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
/**
 * @openapi
 * /api/v1/customers/addCustomer:
 *   post:
 *     tags:
 *       - "Customer"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               salutation:
 *                 type: "string"
 *               firstName:
 *                 type: "string"
 *               lastName:
 *                 type: "string"
 *               companyName:
 *                 type: "string"
 *               companyDisplayName:
 *                 type: "string"
 *               email:
 *                 type: "string"
 *               phone:
 *                 type: "string"
 *               customerType:
 *                 type: "string"
 *     responses:
 *       "200":
 *         description: "Customer added successfully"
 */
router.post("/addCustomer", auth_1.verifyToken, [
    (0, express_validator_1.check)("salutation", "This field is required").isString(),
    (0, express_validator_1.check)("firstName", "This field is required").isString(),
    (0, express_validator_1.check)("lastName", "This field is required").isString(),
    (0, express_validator_1.check)("companyName", "This field is required").isString(),
    (0, express_validator_1.check)("companyDisplayName", "This field is required").isString(),
    (0, express_validator_1.check)("email", "This field is required").isEmail(),
    (0, express_validator_1.check)("phone", "This field is required").isString(),
    (0, express_validator_1.check)("customerType", "This field is required").isString(),
], customers_1.addCustomer);
/**
 * @openapi
 * /api/v1/customers:
 *   get:
 *     tags:
 *       - "Customer"
 *     responses:
 *       "200":
 *         description: "List of customers"
 */
router.get("/", auth_1.verifyToken, customers_1.getCustomers);
/**
 * @openapi
 * /api/v1/customers/{id}:
 *   get:
 *     tags:
 *       - "Customer"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Customer ID"
 *         schema:
 *           type: "string"
 *     responses:
 *       "200":
 *         description: "Customer details"
 */
router.get("/:id", auth_1.verifyToken, customers_1.getCustomer);
exports.default = router;
