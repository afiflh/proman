const { response } = require("express");
const { ProjectStatusModel, ProjectAssignmentModel, TaskListModel, ProjectAssigneeModel } = require("../../models");
const { ResponseHandler, createLog, CustomError } = require("../../utils");
const { generateUuid } = require("../../utils/uuidGenerator");
const { DateFormatter } = require("../../utils");

const ProjectStatus = new ProjectStatusModel();
const ProjectAssignment = new ProjectAssignmentModel();
const ProjectAssignee = new ProjectAssigneeModel();
const Tasklist = new TaskListModel();

class ProjectStatusService {
    static async provideGetAll() {
        const datas = await ProjectStatus.findAll();
        const dataResponse = datas.length > 0
            ? datas.map((data) => {
                return {
                    id: data.id,
                    project_id: data.project_id,
                    project_name: data.project_name,
                    description: data.description,
                    project_status: data.project_status,
                    username: data.username,
                    created_by: data.created_by,
                    created_by_name: data.created_by_name,
                    created_time: DateFormatter.formatDate(data.created_at),
                    updated_by: data.updated_by,
                    updated_by_name: data.updated_by_name,
                    updated_time: DateFormatter.formatDate(data.updated_at),
                };
            })
            : [];

        return dataResponse;
    }

    static async provideStore(bodyRequest, AuthUser) {
        const existData = await ProjectStatus.findByProjectId(bodyRequest.project_id);
        if (existData) {
            throw new CustomError(`Failed insert new data, data is existed!`, 400);
        }

        const inputRequestProjectStatus = {
            id: generateUuid(),
            project_id: bodyRequest.project_id,
            project_status: bodyRequest.project_status,
            created_by: bodyRequest.created_by,
            updated_by: bodyRequest.created_by,
        };

        const userList = bodyRequest.user_assignment.split(",");
        const inputRequestProjectAssignment = userList.map((user) => {
            return {
                id: generateUuid(),
                project_id: bodyRequest.project_id,
                user_assignment: user,
            };
        });

        await ProjectStatus.create(inputRequestProjectStatus);
        for (let i = 0; i <= inputRequestProjectAssignment.length - 1; i++) {
            await ProjectAssignment.create(inputRequestProjectAssignment[i]);
        }

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Menambahkan data baru ke tabel PM_Project_Status: ${inputRequestProjectStatus.id}`
        );
    }

    static async provideUpdate(bodyRequest, projectStatusId, AuthUser) {
        const prevData = await ProjectStatus.findById(projectStatusId);
        if (!prevData) {
            throw new CustomError("Failed edit data, data not found!", 400);
        }

        const inputRequestProjectStatus = {
            project_status: bodyRequest.project_status ?? prevData.project_status,
            updated_by: bodyRequest.updated_by ?? prevData.updated_by,
            id: projectStatusId,
        };

        // Melakukan pengecekan sebelum melakukan update data pm_status, mengecek relasi dengan data lain
        const arrayPrevStatus = new Set(prevData.project_status.split(","));
        const arrayNewStatus = new Set(bodyRequest.project_status.split(","));
        const toDeleteStatus = [...arrayPrevStatus].filter(status => !arrayNewStatus.has(status));
        const stillUsedStatus = []; // variabel yang digunakan untuk menentukan update data status dijalankan atau tidak

        for (let i = 0; i < toDeleteStatus.length; i++) {
            const usedByTasklist = await Tasklist.findByProjectandStatus(prevData.project_id, toDeleteStatus[i]);
            if (usedByTasklist.length > 0) {
                stillUsedStatus.push(toDeleteStatus[i]);
            }
        }

        if (stillUsedStatus.length > 0) {
            throw new CustomError(`Failed update data, status [${[...stillUsedStatus]}] is still used in Project Task`, 400);
        }


        let inputRequestProjectAssignment = bodyRequest.user_assignment
            ? bodyRequest.user_assignment.split(",")
            : null;

        if (inputRequestProjectAssignment !== null) {
            // Pengecekan apakah terdapat data assignee yang masih di gunakan di tabel pm_tasklist
            let prevAssignees = await ProjectAssignee.findAssigneeByProject(prevData.project_id);
            if (prevAssignees.length > 0) {
                let arrayPrevAssignee = new Set(prevAssignees.map((data) => data.assignee_id));
                let arrayNewAssignee = new Set(inputRequestProjectAssignment);
                let toDeleteAssignee = [...arrayPrevAssignee].filter(assignee_id => !arrayNewAssignee.has(assignee_id));
                let toDeleteAssigneeFullData = [...prevAssignees].filter(assignee => toDeleteAssignee.includes(assignee.assignee_id));

                let stillUsedAssignee = []; // variabel yang digunakan untuk menentukan update data assignee dijalankan atau tidak

                for (let i = 0; i < toDeleteAssigneeFullData.length; i++) {
                    const usedByTasklist = await Tasklist.findAssigneeByProjectAndName(prevData.project_id, toDeleteAssigneeFullData[i].assignee_name);
                    console.log('used by tasklist->', usedByTasklist);
                    if (usedByTasklist) {
                        stillUsedAssignee.push(toDeleteAssigneeFullData[i].assignee_name);
                    }
                }

                if (stillUsedAssignee.length > 0) {
                    throw new CustomError(`Failed edit data, assignee [${[...stillUsedAssignee]}] is still used in Project Task`, 400);
                }
            }

            inputRequestProjectAssignment = inputRequestProjectAssignment.map((dataUserAssignment) => {
                return {
                    id: generateUuid(),
                    project_id: prevData.project_id,
                    user_assignment: dataUserAssignment,
                };
            });

            // delete all user from table pm_project_assignment
            await ProjectAssignment.deleteAssigneeByProject(prevData.project_id);
            // insert all updation data to table pm_project_assignment
            for (let i = 0; i <= inputRequestProjectAssignment.length - 1; i++) {
                await ProjectAssignment.create(inputRequestProjectAssignment[i]);
            }
        }

        await ProjectStatus.update(inputRequestProjectStatus);

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Memperbarui data di tabel PM_Project_Status: ${projectStatusId}`
        );
    }

    static async provideDelete(projectStatusId, AuthUser) {
        const existedData = await ProjectStatus.findById(projectStatusId);
        if (!existedData) {
            throw new CustomError("Failed delete data, data not found!", 400);
        }

        // Pengecekan data yang masih berelasi dengan data saat ini yang akan dihapus
        const usedByTasklist = await Tasklist.findByProjectID(existedData.project_id);
        if (usedByTasklist.length > 0) {
            throw new CustomError("Failed delete data, data is still referenced by another relation", 400)

        }

        await ProjectStatus.delete(projectStatusId);
        await ProjectAssignment.deleteAssigneeByProject(existedData.project_id);

        // Create activity log data
        const createLogs = await createLog(
            AuthUser.id,
            `Menghapus data dari tabel PM_Project_Status: ${projectStatusId}`
        );
    }
}

module.exports = ProjectStatusService;