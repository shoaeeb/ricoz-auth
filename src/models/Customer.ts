import mongoose from "mongoose";

export type CustomerType = {
  userId: mongoose.Types.ObjectId;
  salutation: string;
  firstName: string;
  lastName: string;
  companyName: string;
  companyDisplayName: string;
  email: string;
  phone: string;
  customerType: string;
};

const customerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  salutation: {
    type: String,
    required: true,
    enum: {
      values: ["Mr", "Mrs", "Ms", "Dr"],
      message: "{VALUE} is not supported",
    },
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyName: { type: String, required: true },
  companyDisplayName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  customerType: { type: String, required: true },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
