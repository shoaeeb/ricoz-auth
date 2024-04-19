import asyncWrapper from "../async-wrapper/async-wrapper";
import { Request, Response, NextFunction } from "express";
import Customer from "../models/Customer";
import { validationResult } from "express-validator";

export const addCustomer = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    console.log(req.userId);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const {
      salutation,
      firstName,
      lastName,
      companyName,
      companyDisplayName,
      email,
      phone,
      customerType,
    } = req.body;

    const newCustomer = new Customer({
      userId: req.userId,
      firstName,
      lastName,
      companyName,
      companyDisplayName,
      email,
      phone,
      customerType,
      salutation,
    });
    await newCustomer.save();
    const response = {
      statusCode: 201,
      success: true,
      message: "Customer created successfully",
      data: newCustomer,
    };
    res.status(200).json(response);
  }
);

export const getCustomers = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const customers = await Customer.find({ userId: req.userId });
    res.status(200).json(customers);
  }
);

export const getCustomer = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.params.id;
    const customer = await Customer.findOne({
      userId: req.userId,
      _id: customerId,
    });
    if (!customer) {
      res
        .status(404)
        .json({ errors: `Customer not found with id ${customerId}` });
      return;
    }
    const response = {
      statusCode: 200,
      success: true,
      message: "Customer found successfully",
      data: customer,
    };
    res.status(200).json(response);
  }
);
