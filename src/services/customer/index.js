const { CustomerModel, PurchaseOrderModel, TaskListModel, StatusModel } = require("../../models");
const { ResponseHandler, DateFormatter, createLog, CustomError } = require("../../utils");

const Customer = new CustomerModel();
const PurchaseOrder = new PurchaseOrderModel();
const Tasklist = new TaskListModel();
const Status = new StatusModel();

class CustomerService {
    static async provideGetCustomerProjects(customerId) {
        const existedCustomer = await Customer.findById(customerId);
        if (!existedCustomer) {
            throw new CustomError('user not found', 400);
        }

        let datas = await PurchaseOrder.findCustomerProjects(customerId)
        datas = await Promise.all(datas.map(async item => {
            let statusData = [];
            let arrayStatus = item.project_status.split(',');
            for (let i = 0; i < arrayStatus.length; i++) {
                let statusCount = await Tasklist.getCountByStatus(item.project_id, arrayStatus[i]);
                let statusName = await Status.findById(arrayStatus[i]);

                statusData.push({
                    status_id: arrayStatus[i],
                    status_name: statusName.name,
                    count: statusCount
                })
            }
            return {
                customer_id: item.customer_id,
                project_id: item.project_id,
                project_name: item.project_name,
                project_start_date: DateFormatter.formatDateNoTime(item.start_date),
                project_end_date: DateFormatter.formatDateNoTime(item.end_date),
                project_status_assignment: statusData
            }
        }))

        return datas;
    }

    static async provideGetAll() {
        const data = await Customer.findAll();
        return data;
    }

    static async provideStore(bodyRequest, AuthUser) {
        const existedCustomer = await Customer.findById(bodyRequest.id);
        if (existedCustomer !== null) {
            throw new CustomError('existed data with same id', 400)
        }

        const inputRequest = {
            id: bodyRequest.id,
            name: bodyRequest.name,
            is_active: bodyRequest.is_active,
            created_by: bodyRequest.created_by
        };

        await Customer.store(inputRequest);

        // Create activity log data
        const createLogs = await createLog(
            AuthUser.id,
            `Menambahkan data baru ke tabel Customer: ${inputRequest.name}`
        );
        if (createLogs) {
            console.info('[INFO]: success create data logs (create new customer)')
        }
    }

    static async provideUpdate(bodyRequest, customerId, AuthUser) {
        const existedCustomer = await Customer.findById(customerId);
        if (existedCustomer === null) {
            throw new CustomError('customer data not found', 400)
        }

        const inputRequest = {
            cust_id: customerId,
            name: bodyRequest.name ?? existedCustomer.name,
            is_active: bodyRequest.is_active ?? existedCustomer.is_active,
            updated_by: bodyRequest.updated_by ?? existedCustomer.updated_by
        };

        await Customer.update(inputRequest);

        // Create activity log data
        const createLogs = await createLog(
            AuthUser.id,
            `Memperbarui data di tabel Customer`
        );
        if (createLogs) {
            console.info('[INFO]: success create data logs (update customer)')
        }
    }

    static async provideDelete(customerId, AuthUser) {
        const existedCustomer = await Customer.findById(customerId);
        if (existedCustomer === null) {
            throw new CustomError('data not found', 400);
        }

        const existedPurchaseOrder = await PurchaseOrder.findByCustomer(customerId);
        if (existedPurchaseOrder !== null) {
            throw new CustomError('failed delete data, data is still reference to another relations', 400);
        }

        await Customer.delete(customerId);

        // Create activity log data
        const createLogs = await createLog(
            AuthUser.id,
            `Menghapus data dari tabel Customer: ${existedCustomer.name}`
        );
        if (createLogs) {
            console.info('[INFO]: success create data logs (update customer)')
        }
    }

}

module.exports = CustomerService;