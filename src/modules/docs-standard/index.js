const { ResponseHandler, CustomError, logger } = require("../../utils");
const path = require("path");
const fs = require("fs");

class DocsStandardModule {
  static async getAll(req, res, next) {
    try {
      const docPath = path.join(__dirname, "../../storage/public/docs-standard");

      const docFiles = fs.readdir(docPath, (err, files) => {
        if (err) {
          return next(new CustomError("failed read docs-standard folder", 500));
        }

        files = files.map((file) => {
          return {
            filename: file,
            description: file.match(/_(.*?)\.[^_.]+$/)[1],
          };
        });

        return ResponseHandler.success(req, res, "Success get docs-standard", files, 200);
      });
    } catch (error) {
      return next(error);
    }
  }

  static async downloadDocs(req, res, next) {
    try {
      const { filename } = req.params;
      const docPath = path.join(__dirname, "../../storage/public/docs-standard", filename);
      res.download(docPath, filename, (err) => {
        if (err) {
          return next(new CustomError("failed download file", 400));
        }

        logger.info(`file ${filename} downloaded`);
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = DocsStandardModule;
