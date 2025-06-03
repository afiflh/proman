const { ResponseHandler } = require("../../utils");
const { uploadMultiple } = require("../../utils/multer");

class FileHandlerMiddleware {
  static multipleUpload(req, res, next) {
    uploadMultiple.array("objectFiles", 5)(req, res, (err) => {
      if (err) {
        return ResponseHandler.error(res, err.message, {}, 400);
      }
      const files = req.files;
      req.files = files;
      next();
    });
  }
}

module.exports = FileHandlerMiddleware;
