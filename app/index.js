import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import cookieSession from "cookie-session";
import manifests from "./routes/manifestRoutes.js";
import users from "./routes/userRoutes.js";
import "dotenv/config";
import passport from "passport";
import User from "./models/users.js";
import LocalStrategy from "./middleware/localAuth.js";

const app = express();

// const allowedOrigins = ["https://manifest-tracker-client.fly.dev/", "http://localhost:5173"];

// const corsOptions = {
//   // origin: function (origin, callback) {
//   //   if (!origin || allowedOrigins.includes(origin)) {
//   //     callback(null, true);
//   //   } else {
//   //     callback(new Error("Not allowed by CORS"));
//   //   }
//   // },
//   origin: "*",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   preflightContinue: false,
//   credentials: true,
//   optionsSuccessStatus: 200,
// };
// // CORS issues happening
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

// See if this works
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

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
  console.log(`4: Serialize user: ${JSON.stringify(user.id)}`);
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`5: Deserializing user:${id}`);
  try {
    const user = await User.findById(id);

    if (!user) {
      return done(new Error("No user with id is found"));
    }

    return done(null, { id: user.id, username: user.username });
  } catch (error) {
    console.log(error);
  }
});

passport.use("local", LocalStrategy);

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
