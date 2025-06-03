const express = require("express");
const router = express.Router();
const { DocsStandardModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get(
    "/api/v1/docs-standard",
    [
        middleware.use("auth")
    ],
    DocsStandardModule.getAll
)

router.get(
    "/api/v1/docs-standard/download/:filename",
    [
        middleware.use("auth")
    ],
    DocsStandardModule.downloadDocs
)

module.exports = router;