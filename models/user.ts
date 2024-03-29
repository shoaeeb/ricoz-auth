import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

type UserType = {
  _id: string;
  email: string;
  username: string;
  password: string;
  generateToken: () => string;
};

const userSchema = new mongoose.Schema<UserType>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET_KEY as string
  );
  return token;
};

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

const User = mongoose.model<UserType>("user", userSchema);

export default User;
