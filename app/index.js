import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import manifests from "./routes/manifestRoutes.js";
import users from "./routes/userRoutes.js";
import "dotenv/config";

const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors(corsOptions));

app.use("/api/v1/manifests", manifests);
app.use("/users", users);

// MongoDB connection
const { CONNECTION_STRING } = process.env;

mongoose.set("strictQuery", true);

async function main() {
  await mongoose.connect(CONNECTION_STRING);
}

main().catch((error) => {
  throw error;
});

export default app;
