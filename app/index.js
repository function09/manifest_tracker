import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcryptjs";
import cookieSession from "cookie-session";
import manifests from "./routes/manifestRoutes.js";
import users from "./routes/userRoutes.js";
import "dotenv/config";
import passport from "passport";
import { Strategy } from "passport-local";
import { findUser } from "./services/userDatabaseFunctions.js";

const app = express();

const allowedOrigins = ["http://localhost:3000", "https://manifest-tracker-client.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // credentials: true,
  optionsSuccessStatus: 200,
};
// CORS issues happening
app.use(cors(corsOptions));
app.options("/api/v1/manifests", cors());
// app.use(
//   cookieParser(process.env.SECRET, {
//     sameSite: "lax",
//   })
// );
// app.use(
//   session({
//     secret: process.env.SECRET,
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//       maxAge: 60000 * 60,
//       httpOnly: true,
//       sameSite: "lax",
//     },
//   })
// );
app.use(
  cookieSession({
    name: "auth",
    keys: [process.env.SECRET],
    maxAge: 60 * 60 * 24,
  })
);
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log(`4: Serialize user: ${JSON.stringify(user.UUID)}`);
  return done(null, user.UUID);
});

passport.deserializeUser((UUID, done) => {
  // This needs proper handling, switch to using mongoDB IDs
  console.log(`4: Deserializing user:${UUID}`);
});

passport.use(
  "local",
  // Set this  as a function in its own file in middleware
  new Strategy({ passReqToCallback: true }, async (req, username, password, done) => {
    console.log(`2: Local strategy verify cb: ${JSON.stringify({ username })}`);
    // This is where we call the db to verify user
    const user = await findUser(username);

    if (!user) {
      return done(null, false);
    }

    const passwordCheck = await new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });

    if (!passwordCheck) {
      return done("Username or password are incorrect.", null);
    }

    return done(null, user);

    // console.log(`user from db: ${JSON.stringify(user)}`);
    // return done(null, { id: "test" });
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/api/v1/manifests", manifests);
app.use("/users", users);

// MongoDB connection
const { CONNECTION_STRING } = process.env;

mongoose.set("strictQuery", true);

async function main() {
  await mongoose.connect(CONNECTION_STRING);
}

main().catch((error) => {
  console.log(error);
});

export default app;
