/* eslint-disable object-curly-spacing */
import express from "express";
import cors from "cors";
import { config } from "dotenv";
// const { io } = require('socket.io')()
import morgan from "morgan";
import logger from "./config/index.js";
import v1Router from "./routes/index.js";
import "./db/index.js";
import postResponse from "./utils/postResponse.utils.js";

config();

const app = express();
const port = process.env.PORT_ || 5000;
// global.logger = logger;
app.use(cors());
app.use(morgan("combined", { stream: logger.stream }));

app.use((req, res, next) => {
  console.log(`\tRequesting ${req.url}`);
  console.log(`\tRequest Parameters (Body):: ${req.body}`);
  console.log(`\tRequest Parameters (Query):: ${req.query}`);
  console.log(`\tRequest Parameters (Query):: ${req.params}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api/v1", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "Welcome to ElRoi API",
    data: process.env,
  })
);
app.use(postResponse);
app.use("/api/v1", v1Router);

app.use((req, res, next) => {
  const err = new Error(`${req.originalUrl}: No endpoint found`);
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500).json({
    status: "error",
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

app.listen(port, () => {
  console.log(`::Server running at port ${port} on ${process.env.NODE_ENV}`);
});

export default app;
