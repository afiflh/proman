const { ResponseHandler } = require("../../utils");
const { CustomerService: Service } = require('../../services');

class CustomerModule {

    static async getCustomerProjects(req, res, next) {
        try {
            const { cust_id } = req.params;

            const result = await Service.provideGetCustomerProjects(cust_id);

            return ResponseHandler.success(req, res, 'success', result, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const result = await Service.provideGetAll();
            return ResponseHandler.success(req, res, 'Success get data customer', result, 200);
        } catch (error) {
            return next(error)
        }
    }

    static async store(req, res, next) {
        try {
            const { bodyRequest } = req;
            const AuthUser = req.userData;

            const execution = await Service.provideStore(bodyRequest, AuthUser);

            ResponseHandler.success(req, res, 'Success create data customer', {}, 200);
        } catch (error) {
            return next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { cust_id } = req.params;
            const { bodyRequest } = req;
            const AuthUser = req.userData;

            const execution = await Service.provideUpdate(bodyRequest, cust_id, AuthUser);

            ResponseHandler.success(req, res, 'Success update data customer', {}, 200);
        } catch (error) {
            return next(error)
        }
    }

    static async delete(req, res, next) {
        try {
            const { cust_id } = req.params;
            const AuthUser = req.userData;

            const execution = await Service.provideDelete(cust_id, AuthUser);

            ResponseHandler.success(req, res, 'Success delete data customer', null, 200);
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = CustomerModule;