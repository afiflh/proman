const { ResponseHandler, CustomError } = require("../../utils");
const { ReportUserTaskService: Service } = require('../../services')

class ReportUserTasksModule {
    static async getReport(req, res, next) {
        try {
            const { project_id, mode, group_id, start_date, end_date } = req.query;
            if (!start_date || !end_date) {
                return next(new CustomError('Failed get data reports, parameters [start_date, end_date] don\'t match', 400))
            }
            const result = await Service.provideGetReport(project_id, mode, group_id, end_date, start_date);
            ResponseHandler.success(req, res, 'Success get KPI reports', result, 200);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = ReportUserTasksModule;