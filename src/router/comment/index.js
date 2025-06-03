const express = require("express");
const router = express.Router();
const { CommentModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.post(
    "/api/v1/comments/store",
    [
        middleware.use("auth"),
        ...decryptionMiddleware,
        middleware.use("modeChecker"),
        middleware.use("validator.createComment"),
    ],
    CommentModule.store
)
router.get('/api/v1/comments/:identifier/:mode/params', [middleware.use('auth')], CommentModule.getByParams); // deprecated
router.get('/api/v1/comments/:tasklist_id/tasklist', [middleware.use('auth')], CommentModule.getByTasklist);
router.get('/api/v1/comments/:subtasklist_id/subtasklist', [middleware.use('auth')], CommentModule.getBySubtasklist);
router.get('/api/v1/comments/:projectId/user-assigned', [middleware.use('auth')], CommentModule.getUserTagged)

// router.get('/api/v1/comments/:tasklistId/:mode/get', [middleware.use('auth')], commentsModule.getByTasklist); // deprecated

module.exports = router;