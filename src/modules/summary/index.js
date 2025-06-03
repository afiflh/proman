const { ResponseHandler } = require("../../utils");
const { SummaryService: Service } = require("../../services");

class SummaryModule {

    static async getMilestoneProjectList(req, res, next) {
        try {
            const result = await Service.provideGetMilestoneProjectList();
            return ResponseHandler.success(req, res, 'success get data', result, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async assignmentProgress(req, res, next) {
        try {
            const { userData } = req;
            const result = await Service.provideAssignmentProgress(userData.id);
            return ResponseHandler.success(req, res, "Success fetch data", result, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async projectProgress(req, res, next) {
        try {
            const result = await Service.provideProjectProgress();
            return ResponseHandler.success(req, res, "Success fetch data", result, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async getHighPriorityProject(req, res, next) {
        try {
            const { userData } = req;
            const result = await Service.provideGetHighPriorityProject(userData.id);
            return ResponseHandler.success(req, res, 'Success fetch data', result, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async getProjectsByParameterId(req, res, next) {
        try {
            const result = await Service.provideGetProjectsByParameterId();
            return ResponseHandler.success(req, res, "Success fetch data", result, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async getImplementationSubs(req, res, next) {
        try {
            const result = await Service.provideGetImplementationSubs();
            return ResponseHandler.success(req, res, "Success fetch data sub implementation", result, 200);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = SummaryModule;
