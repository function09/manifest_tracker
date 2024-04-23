import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import manifests from "./routes/manifestRoutes.js";
import users from "./routes/userRoutes.js";
import "dotenv/config";

const app = express();

const corsOptions = {
  origin: "https://manifest-tracker-client-5unk.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
      httpOnly: true,
    },
  })
);
app.use(express.json());
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
