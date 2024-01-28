import express from "express";
import morgan from "morgan";
import router from "./routes/routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/", router);
export default app;
