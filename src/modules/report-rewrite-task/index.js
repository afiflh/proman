const { ResponseHandler } = require("../../utils");
const { ReportRewriteTaskService: Service } = require('../../services')

class ReportRewriteTaskModule {
    static async getRewriteTask(req, res, next) {
        try {
            const projectId = req.params.projectId;
            const result = await Service.provideGetRewriteTask(projectId);
            return ResponseHandler.success(req, res, 'success get data report rewrite task', result, 200);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = ReportRewriteTaskModule;