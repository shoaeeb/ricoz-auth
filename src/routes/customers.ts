import express from "express";
import {
  addCustomer,
  getCustomers,
  getCustomer,
} from "../controllers/customers";
import { verifyToken } from "../middlewares/auth";
import { check } from "express-validator";

const router = express.Router();

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
router.get("/", verifyToken, getCustomers);
router.get("/:id", verifyToken, getCustomer);

export default router;
