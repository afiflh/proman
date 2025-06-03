const { ResponseHandler } = require("../../utils");

const { ReportTimeFrameProjectService: Service } = require('../../services')

class ReportTimeframeModule {
    static async getReportProject(req, res, next) {
        try {
            const projectId = req.params.project;
            const result = await Service.provideGetReportProject(projectId);
            return ResponseHandler.success(req, res, 'success get data report projeces', result, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async getReportAssignment(req, res, next) {
        try {
            const projectId = req.params.project;
            const result = await Service.provideGetReportAssignment(projectId);
            return ResponseHandler.success(req, res, 'success get data report timeframe project', result, 200);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = ReportTimeframeModule