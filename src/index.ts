import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import errorMiddleWare from "./middlewares/error-middlware";
import userRouter from "./routes/users";

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json()); // to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // to parse URL-encoded bodies
app.use("/api/v1", userRouter);

app.use(errorMiddleWare);

app.listen(port, () => {
  console.log(`server is listening to ${port}`);
});
