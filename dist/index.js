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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_1 = require("./controllers/auth");
const error_middlware_1 = __importDefault(require("./middlewares/error-middlware"));
const users_1 = __importDefault(require("./routes/users"));
const user_1 = __importDefault(require("./models/user"));
const utils_1 = require("./utils/utils");
const customers_1 = __importDefault(require("./routes/customers"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const port = Number(process.env.PORT) || 3000;
mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING);
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
auth_1.passport.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, function (accessToken, refreshToken, profile, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const existingUser = yield user_1.default.findOne({
            email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
        });
        if (existingUser) {
            return cb(null, existingUser);
        }
        else {
            const newUser = new user_1.default({
                email: (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                password: (0, utils_1.generatePassword)(),
                profilePic: profile.profileUrl,
            });
            yield newUser.save();
            return cb(null, newUser);
        }
    });
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); // to parse JSON bodies
app.use(express_1.default.urlencoded({ extended: false })); // to parse URL-encoded bodies
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
// Initialize Passport middleware
app.use(auth_1.passport.initialize());
app.use(auth_1.passport.session());
auth_1.passport.serializeUser((user, done) => {
    if (user._id === undefined) {
        done(new Error("No user id"));
    }
    else {
        console.log(user);
        done(null, user._id.toString());
    }
});
auth_1.passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_1.default.findById(id);
    if (!existingUser) {
        done(new Error(`No user found with id ${id}`));
    }
    else {
        done(null, existingUser);
    }
}));
app.use("/api/v1", users_1.default);
app.use("/api/v1/customers", customers_1.default);
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
app.get("/auth/google", auth_1.passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", auth_1.passport.authenticate("google", { failureRedirect: "/api/v1/login" }), function (req, res) {
    // Successful authentication, redirect home.
    if (!req.user) {
        return;
    }
    console.log("Request", req === null || req === void 0 ? void 0 : req.user._id);
    const token = jsonwebtoken_1.default.sign({ userId: req.user._id }, process.env.JWT_SECRET_KEY);
    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    res.redirect("/");
});
app.use(error_middlware_1.default);
app.listen(port, () => {
    console.log(`server is listening to ${port}`);
});
(0, swagger_1.default)(app, port);
