import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Profile } from "passport-google-oauth20";

import { passport } from "./controllers/auth";
import errorMiddleWare from "./middlewares/error-middlware";
import userRouter from "./routes/users";
import User, { UserType } from "./models/user";
import { generatePassword } from "./utils/utils";

const port = process.env.PORT || 3000;

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
      console.log("profile");
      console.log(profile);
      const existingUser = await User.findOne({
        email: profile.emails?.[0]?.value,
      });
      if (existingUser) {
        return cb(null, existingUser);
      } else {
        const newUser = new User({
          email: profile.emails?.[0]?.value,
          password: generatePassword(),
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

passport.serializeUser((user: any, done: (error: any, id?: string) => void) => {
  if (user._id === undefined) {
    done(new Error("No user id"));
  } else {
    done(null, user._id);
  }
});

passport.deserializeUser(
  async (id, done: (error: any, id?: string) => void) => {
    const user = await User.findById(id);
    if (!user) {
      done(new Error(`No user found with id ${id}`));
    } else {
      done(null, user._id);
    }
  }
);

app.use("/api/v1", userRouter);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
app.use(errorMiddleWare);

app.listen(port, () => {
  console.log(`server is listening to ${port}`);
});
