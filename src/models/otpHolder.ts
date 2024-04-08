import mongoose from "mongoose";

type OtpType = {
  email: string;
  otp: string;
  createdAt: Date;
  name: string;
  password: string;
  phone: string;
};

const otpSchema = new mongoose.Schema<OtpType>({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true }, // expires in 2 minutes,
  name: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: "2m" } },
  phone: { type: String, required: true },
});

const OTPHolder = mongoose.model<OtpType>("otp", otpSchema);
export default OTPHolder;
