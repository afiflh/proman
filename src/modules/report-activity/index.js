const { ReportActivityModel } = require("../../models");
const { ResponseHandler, DateFormatter } = require("../../utils");

const reportActivity = new ReportActivityModel();

const { ReportActivityService: Service } = require('../../services')

class ReportActivityModule {
  static async getReports(req, res, next) {
    try {
      const { group_id } = req.query;
      const result = await Service.provideGetReports(group_id);
      ResponseHandler.success(req, res, 'Success fetching activity log data', result, 200);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ReportActivityModule;
