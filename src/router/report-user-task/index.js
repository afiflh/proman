const express = require("express");
const router = express.Router();
const { ReportUserTaskModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get("/api/v1/user-task", [middleware.use("auth")], ReportUserTaskModule.getReport);

module.exports = router;