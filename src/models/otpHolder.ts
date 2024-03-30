import mongoose from "mongoose";

type OtpType = {
  email: string;
  otp: string;
  createdAt: Date;
};

const otpSchema = new mongoose.Schema<OtpType>({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true }, // expires in 2 minutes,
  createdAt: { type: Date, default: Date.now, index: { expires: "2m" } },
});

const OTPHolder = mongoose.model<OtpType>("otp", otpSchema);
export default OTPHolder;
