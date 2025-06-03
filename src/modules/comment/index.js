const { ResponseHandler, } = require("../../utils");

const { CommentService: Service } = require('../../services');

class CommentModule {

    static async getUserTagged(req, res, next) {
        try {
            const { projectId } = req.params;

            const result = await Service.provideGetUserTagged(projectId);

            return ResponseHandler.success(req, res, 'succes get data', result, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async store(req, res, next) {
        try {
            const { bodyRequest } = req;

            const execution = await Service.provideStore(bodyRequest);

            return ResponseHandler.success(req, res, "success insert new data", {}, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async getByParams(req, res, next) {
        try {
            const { identifier } = req.params;
            const { mode } = req.params;

            const result = Service.ProvideGetByParams(identifier, mode);

            return ResponseHandler.success(req, res, `success get comments data from ${mode}`, result, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async getByTasklist(req, res, next) {
        try {
            if (!req.params.tasklist_id) {
                return next(new CustomError('error get comments, unknown parameter tasklist_id', 400));
            }
            const { tasklist_id } = req.params;

            const result = await Service.provideGetByTasklist(tasklist_id);

            return ResponseHandler.success(req, res, `success get comments data from tasklist`, result, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async getBySubtasklist(req, res, next) {
        try {
            if (!req.params.subtasklist_id) {
                return next(new CustomError('error get comments, unknown parameter subtasklist', 400));
            }
            const { subtasklist_id } = req.params;

            const result = await Service.provideGetBySubtasklist(subtasklist_id);

            return ResponseHandler.success(req, res, `success get comments data from subtasklist`, result, 200);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = CommentModule;