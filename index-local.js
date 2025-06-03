const express = require("express");
const { LISTEN_PORT, FRONTEND_URL } = require("./src/config/env");
const router = require("./src/router");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { logger } = require("./src/utils");
const WebSocket = require('ws');
const cookieParser = require("cookie-parser");


// initial function
const app = express();

// run jobs
try {
  require('./src/utils/jobs/kpiLogs/index');
} catch (err) {
  logger.error('Failed to start KPI job:', err);
  console.error('Failed to start KPI job:', err);
}

app.use(express.static(path.join("src", "storage", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// global middleware --- body parser, rate limit , etc
// const allowedOrigins = ['https://cxt.co.id:5173', 'http://localhost:5173'];
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// global router
router(app);

const appPort = LISTEN_PORT ?? 5005;
const server = app.listen(appPort, () => {
  logger.info(`Server start running on port: ${appPort} (${process.env.MODE})`)
});





