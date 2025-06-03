const express = require("express");
const router = express.Router();
const { ReportActivityModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get("/api/v1/today-activity", [middleware.use("auth")], ReportActivityModule.getReports);

module.exports = router;    