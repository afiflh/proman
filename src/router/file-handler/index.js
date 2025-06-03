const express = require("express");
const router = express.Router();
const { FileHandlerModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];
const { upload, uploadMultiple } = require("../../utils/multer");

router.post(
  "/api/v1/upload/file",
  [middleware.use("auth"), upload.single("objectFiles")],
  FileHandlerModule.uploadFile
);
router.post(
  "/api/v1/upload-multiple/file",
  [middleware.use("auth"), middleware.use("uploadMultiple")],
  FileHandlerModule.multipleUploadFile
);
router.post(
  "/api/v1/update/file",
  [middleware.use("auth"), upload.single("objectFiles")],
  FileHandlerModule.updateFile
);
router.get(
  "/api/v1/download/file/:filename",
  [middleware.use("auth")],
  FileHandlerModule.downloadFile
);

module.exports = router;
