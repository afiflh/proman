const express = require("express");
const { LISTEN_PORT } = require("./src/config/env");
const router = require("./src/router");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const path = require("path");
const { logger } = require("./src/utils");


// initial function
const app = express();

// run jobs
require('./src/utils/jobs/kpiLogs/index')

var options = {
  key: fs.readFileSync("/etc/letsencrypt/live/cxt.co.id/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/cxt.co.id/cert.pem"),
  ca: fs.readFileSync("/etc/letsencrypt/live/cxt.co.id/chain.pem"),
};

// global middleware --- body parser, rate limit , etc
app.use(express.static(path.join("src", "storage", "public")));

// const allowedOrigins = ['https://cxt.co.id:5173', 'http://localhost:5173'];

app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// global router
router(app);

const server = https.createServer(app);

const appPort = LISTEN_PORT ?? 5006;

function serveStart() {
  logger.info(`Server start running on port: ${appPort} (${process.env.MODE})`)
}

server.listen(appPort, serveStart);
server.on('error', (err) => {
  logger.error('Server failed to start:', err);
  console.error('Server failed to start:', err);
});