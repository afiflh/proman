const express = require("express");
const router = express.Router();
const { ReportTimeframeModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get(
    "/api/v1/project-time-frame/:project",
    [
        middleware.use("auth"),
    ],
    ReportTimeframeModule.getReportProject
);

router.get(
    "/api/v1/assign-time-frame/:project",
    [
        middleware.use("auth"),
    ],
    ReportTimeframeModule.getReportAssignment
);


module.exports = router;
