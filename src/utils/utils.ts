import nodemailer from "nodemailer";
import crypto from "crypto";

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.email,
    pass: process.env.email_password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const generateOtp = () => {
  const buffer = crypto.randomBytes(3);
  const otp = Math.abs(buffer.readIntLE(0, 3) % 1000000)
    .toString()
    .padStart(6, "0");
  return otp;
};

function generatePassword() {
  return crypto.randomBytes(20).toString("hex");
}

export { transport, generateOtp, generatePassword };
