import "dotenv/config";

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Profile } from "passport-google-oauth20";

import { passport } from "./controllers/auth";
import errorMiddleWare from "./middlewares/error-middlware";
import userRouter from "./routes/users";
import User, { UserType } from "./models/user";
import { generatePassword } from "./utils/utils";
import { verifyToken } from "./middlewares/auth";
import customerRouter from "./routes/customers";
import swaggerDocs from "./utils/swagger";

const port = Number(process.env.PORT) || 3000;

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb: (error: any, user?: any) => void
    ) {
      const existingUser = await User.findOne({
        email: profile.emails?.[0]?.value,
      });
      if (existingUser) {
        return cb(null, existingUser);
      } else {
        const newUser = new User({
          email: profile.emails?.[0]?.value,
          password: generatePassword(),
          profilePic: profile.profileUrl,
        });
        await newUser.save();
        return cb(null, newUser);
      }
    }
  )
);

app.use(cookieParser());
app.use(express.json()); // to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // to parse URL-encoded bodies

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done: (error: any, user?: any) => void) => {
  if (user._id === undefined) {
    done(new Error("No user id"));
  } else {
    console.log(user);
    done(null, user._id.toString());
  }
});

passport.deserializeUser(async (id, done: (error: any, user?: any) => void) => {
  const existingUser = await User.findById(id);
  if (!existingUser) {
    done(new Error(`No user found with id ${id}`));
  } else {
    done(null, existingUser);
  }
});

app.use("/api/v1", userRouter);
app.use("/api/v1/customers", customerRouter);

/**
 * @openapi
 *   /auth/google:
 *      get:
 *        tags:
 *            - "User"
 *        responses:
 *              "200":
 *                    description : "User LoggedIn / User Created Successfully"
 *
 *
 */
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/login" }),
  function (req: any, res: any) {
    // Successful authentication, redirect home.
    if (!req.user) {
      return;
    }
    console.log("Request", req?.user._id);
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET_KEY as string
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    res.redirect("/");
  }
);

app.use(errorMiddleWare);

app.listen(port, () => {
  console.log(`server is listening to ${port}`);
});

swaggerDocs(app, port);
