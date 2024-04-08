"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomer = exports.getCustomers = exports.addCustomer = void 0;
const async_wrapper_1 = __importDefault(require("../async-wrapper/async-wrapper"));
const Customer_1 = __importDefault(require("../models/Customer"));
const express_validator_1 = require("express-validator");
exports.addCustomer = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(req.userId);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { salutation, firstName, lastName, companyName, companyDisplayName, email, phone, customerType, } = req.body;
    const newCustomer = new Customer_1.default({
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
    yield newCustomer.save();
    res.status(200).json(newCustomer);
}));
exports.getCustomers = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customers = yield Customer_1.default.find({ userId: req.userId });
    res.status(200).json(customers);
}));
exports.getCustomer = (0, async_wrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.id;
    const customer = yield Customer_1.default.findOne({
        userId: req.userId,
        _id: customerId,
    });
    if (!customer) {
        res
            .status(404)
            .json({ errors: `Customer not found with id ${customerId}` });
        return;
    }
    res.status(200).json(customer);
}));
