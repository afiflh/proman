const { ResponseHandler, logger, CustomError } = require("../../utils");
const fs = require("fs");
const path = require("path");
const { uploadMultiple } = require("../../utils/multer");
const multer = require("multer");

class FileHandlerModule {
  static async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return next(new CustomError("upload failed, object file is null", 400))
      }
      const dataResponse = {
        filename: req.file.filename,
      };
      return ResponseHandler.success(req, res, "success upload file", dataResponse, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async multipleUploadFile(req, res, next) {
    try {
      let files = req.files;
      if (files.length === 0) {
        return next(new CustomError("upload failed, object file is null", 400))
      }
      const dataResponse = {
        filename: files.map((item) => {
          return item.filename;
        }),
      };
      return ResponseHandler.success(req, res, "success uploads any files", dataResponse, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateFile(req, res, next) {
    try {
      const { oldFile } = req.body;
      const filePath = path.join(__dirname, "../../storage", "public", "attachments", oldFile);

      if (oldFile !== '') {
        fs.unlink(filePath, (err) => {
          if (err) {
            // return next(err); 
            logger.info(`[INFO]: file not found`);
          } else {
            logger.info(`[INFO]: file deleted`);
          }
        });
      }

      const dataResponse = {
        filename: req.file.filename,
      };
      return ResponseHandler.success(req, res, "success update file", dataResponse, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async downloadFile(req, res, next) {
    try {
      const filename = req.params.filename;
      const filepath = path.join(__dirname, "../../storage", "public", "attachments", filename);
      res.download(filepath, filename, (err) => {
        if (err) {
          return next(err);
        }
        console.log("[INFO]: file downloaded");
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = FileHandlerModule;
