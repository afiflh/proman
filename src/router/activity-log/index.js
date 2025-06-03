const express = require("express");
const router = express.Router();
const { ActivityLogModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get('/api/v1/activity-logs', [middleware.use('auth')], ActivityLogModule.getAll)
router.get('/api/v1/activity-logs/download-all', [middleware.use('auth')], ActivityLogModule.getAlltoDownload)
// router.get('/api/v1/comments/:tasklistId/:mode/get', [middleware.use('auth')], commentsModule.getByTasklist); // deprecated

module.exports = router;