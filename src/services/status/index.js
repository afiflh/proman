const { StatusModel, ProjectStatusModel } = require("../../models");
const { ResponseHandler, createLog, CustomError } = require("../../utils");
const { dateNow } = require("../../utils/dateTime");

const Status = new StatusModel();
const ProjectStatus = new ProjectStatusModel();

class StatusService {
    static async provideGetAll() {
        const result = await Status.findAll();
        return result;
    }

    static async provideStore(bodyRequest, AuthUser) {
        const existedData = await Status.findById(bodyRequest.id);
        if (existedData) {
            throw new CustomError("Failed create new status data, duplicate id", 400)
        }

        const inputRequest = {
            id: bodyRequest.id,
            name: bodyRequest.name,
            description: bodyRequest.description,
            single_process: bodyRequest.single_process ?? false,
            single_assigner: bodyRequest.single_assigner ?? false,
            mode: bodyRequest.mode ?? null,
            created_by: bodyRequest.created_by,
            created_time: dateNow(),
        };

        await Status.create(inputRequest);

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Menambahkan data baru ke tabel PM_Status: ${inputRequest.id}`
        );
    }

    static async provideUpdate(bodyRequest, statusId, AuthUser) {
        const prevData = await Status.findById(statusId);
        if (!prevData) {
            throw new CustomError("Data not found", 400)
        }

        const inputRequest = {
            id: statusId,
            name: bodyRequest.name ?? prevData.name,
            description: bodyRequest.description ?? prevData.description,
            single_process: bodyRequest.single_process ?? prevData.single_process,
            single_assigner: bodyRequest.single_assigner ?? prevData.single_assigner,
            mode: bodyRequest.mode ?? prevData.mode,
        };

        await Status.update(inputRequest);

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Memperbarui data di tabel PM_Status: ${statusId}`
        );
    }

    static async provideDelete(statusId, AuthUser) {
        if (await ProjectStatus.isUsedStatus(statusId)) {
            throw new CustomError("Failed delete status data, status is used in project status", 400)
        }

        await Status.delete(statusId);

        // Create activity log data
        const createLogs = await createLog(
            AuthUser.id,
            `Menghapus data dari tabel PM_Status: ${statusId}`
        );
    }
}

module.exports = StatusService;