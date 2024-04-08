import express from "express";
import {
  addCustomer,
  getCustomers,
  getCustomer,
} from "../controllers/customers";
import { verifyToken } from "../middlewares/auth";
import { check } from "express-validator";

const router = express.Router();

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
router.post(
  "/addCustomer",
  verifyToken,
  [
    check("salutation", "This field is required").isString(),
    check("firstName", "This field is required").isString(),
    check("lastName", "This field is required").isString(),
    check("companyName", "This field is required").isString(),
    check("companyDisplayName", "This field is required").isString(),
    check("email", "This field is required").isEmail(),
    check("phone", "This field is required").isString(),
    check("customerType", "This field is required").isString(),
  ],
  addCustomer
);

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
router.get("/", verifyToken, getCustomers);

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
router.get("/:id", verifyToken, getCustomer);

export default router;
