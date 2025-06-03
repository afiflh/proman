const express = require("express");
const router = express.Router();
const { ParameterModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get("/api/v1/parameters", [middleware.use("auth")], ParameterModule.getAll);
router.get("/api/v1/parameters/project-type", [middleware.use("auth")], ParameterModule.getAllProjectType);
router.get("/api/v1/parameters/project-status", [middleware.use("auth")], ParameterModule.getAllProjectStatus);

router.post(
    "/api/v1/parameters/project-status/store",
    [
        middleware.use("auth"),
        ...decryptionMiddleware,
        middleware.use("modeChecker"),
    ],
    ParameterModule.store
);

router.put(
    "/api/v1/parameters/project-status/:param_id/edit",
    [
        middleware.use("auth"),
        ...decryptionMiddleware,
        middleware.use("modeChecker"),
    ],
    ParameterModule.edit
);

router.delete(
    "/api/v1/parameters/project-status/:param_id/delete",
    [
        middleware.use("auth"),
    ],
    ParameterModule.delete
);
module.exports = router;
