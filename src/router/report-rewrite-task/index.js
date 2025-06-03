const express = require("express");
const router = express.Router();
const { ReportRewriteTaskModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get("/api/v1/rewrite-task/:projectId", [middleware.use("auth")], ReportRewriteTaskModule.getRewriteTask);

module.exports = router;
