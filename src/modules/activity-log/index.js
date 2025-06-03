const { ResponseHandler } = require("../../utils");
const { ActivityLogService: Service } = require("../../services");

class ActivityLogModule {
  static async getAll(req, res, next) {
    try {
      // GET PROPERTIES FOR PAGINATION
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const searchParam = req.query.search;

      const { dataLogs, totalDatas, totalPages } = await Service.getAllLogs({
        limit,
        offset,
        search: searchParam || null,
      });

      const responseData = {
        total_data: totalDatas,
        total_page: totalPages,
        current_page: page,
        data_logs: dataLogs,
      };

      return ResponseHandler.success(
        req,
        res,
        "Success get activity logs data!",
        responseData,
        200
      );
    } catch (error) {
      return next(error);
    }
  }

  static async getAlltoDownload(req, res, next) {
    try {
      let datas = await Service.getAllLogsToDownload();

      return ResponseHandler.success(req, res, "Success get activity logs data!", datas, 200);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ActivityLogModule;
