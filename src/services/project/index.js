
const { ProjectModel, TimeframeModel, ParameterModel, ProjectAssignmentModel } = require("../../models");
const { ResponseHandler, createLog, CustomError } = require("../../utils");
const { DateFormatter } = require('../../utils');

const Project = new ProjectModel();
const Timeframe = new TimeframeModel();
const ParameterStatus = new ParameterModel();
const ProjectAssigment = new ProjectAssignmentModel();

class ProjectService {

    static async provideGetUnassignedProjects() {
        const allProjects = await Project.findAll();
        const assignedProjects = await ProjectAssigment.findProjectId();

        if (!Array.isArray(assignedProjects)) {
            throw new Error('assignedProjects should be an array');
        }

        // Membuat set dari project IDs yang sudah ada di assignment
        const assignedProjectIds = new Set(assignedProjects.map(project => project.project_id));

        // Filter proyek yang tidak ada di assignedProjectIds
        const unassignedProjects = allProjects.filter(project => !assignedProjectIds.has(project.id));

        const formattedData = unassignedProjects.map(project => ({
            id: project.id,
            name: project.name,
        }));

        return formattedData;
    }

    static async provideStore(bodyRequest, AuthUser) {
        const existedData = await Project.findById(bodyRequest.id);
        if (existedData) {
            throw new CustomError("failed create new data, duplication id of data", 400);
        }

        const inputRequest = {
            id: bodyRequest.id,
            name: bodyRequest.name,
            description: bodyRequest.description,
            status: bodyRequest.status,
            substatus: bodyRequest.substatus || null,
            status_info: bodyRequest.status_info || null,
            start_date: bodyRequest.start_date,
            end_date: bodyRequest.end_date,
            created_by: bodyRequest.created_by,
            updated_by: bodyRequest.created_by,
        };

        await Project.create(inputRequest);

        // start time frame manipulation //
        const projectParameterStatus = await ParameterStatus.findByData(bodyRequest.status);
        const inputRequestTimeFrame = {
            project_id: bodyRequest.id,
            previous_status_id: null,
            status_id: projectParameterStatus.id,
            start_time: DateFormatter.dateNow(),
            user_id: bodyRequest.created_by,
        };
        await Timeframe.createProjectTimeframe(inputRequestTimeFrame);
        // end time frame manipulation //

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Menambahkan data baru ke tabel PM_Project: ${bodyRequest.id}`
        );
    }

    static async provideGetAll() {
        const data = await Project.findAll();
        const formattedData = data.map(row => ({
            ...row,
            created_time: row.created_time ? DateFormatter.formatDate(row.created_time) : null, // Cek jika ada nilai sebelum format
            updated_time: row.updated_time ? DateFormatter.formatDate(row.updated_time) : null  // Cek jika ada nilai sebelum format
        }));
  
        return formattedData;
    }

    static async provideGetProjectWithMostTodoTasks() {
        const topProject = await Project.findTopProjectByTodoTasks();

        return topProject;
    }

    static async provideUpdate(bodyRequest, projectId, AuthUser) {
        const prevData = await Project.findById(projectId);
        if (!prevData) {
            throw new CustomError("data not found", 400)
        }
        if (bodyRequest.status !== undefined) {
            const foundedParameter = await ParameterStatus.findByData(bodyRequest.status);
            if (foundedParameter === null) {
                throw new CustomError('parameter status not found', 400)
            }
        }

        const inputRequest = {
            id: projectId,
            name: bodyRequest.name ?? prevData.name,
            description: bodyRequest.description ?? prevData.description,
            status: bodyRequest.status ?? prevData.status,
            substatus: bodyRequest.substatus ?? prevData.substatus,
            status_info: bodyRequest.status_info ?? prevData.status_info,
            start_date: bodyRequest.start_date ?? prevData.start_date,
            end_date: bodyRequest.end_date ?? prevData.end_date,
            updated_by: bodyRequest.updated_by ?? prevData.updated_by,
        };

        await Project.update(inputRequest);

        // start time frame manipulation //
        if ((bodyRequest.status !== undefined && prevData.status !== bodyRequest.status) || (bodyRequest.updated_by !== undefined && prevData.updated_by !== bodyRequest.updated_by)) {
            const updatedTime = DateFormatter.dateNow()

            const previousTimeframe = await Timeframe.findLastProjectTimeframe(prevData.id);
            if (previousTimeframe !== null) {
                await Timeframe.updateProjectEndTime(previousTimeframe.id, updatedTime);
            }

            const previousProjectStatus = await ParameterStatus.findByData(prevData.status);
            const latestProjectStatus = await ParameterStatus.findByData(bodyRequest.status) ?? null;

            const inputRequestTimeFrame = {
                project_id: prevData.id,
                previous_status_id: previousProjectStatus.id,
                status_id: latestProjectStatus !== null ? latestProjectStatus.id : previousProjectStatus.id,
                start_time: updatedTime,
                user_id: (bodyRequest.updated_by !== undefined) ? bodyRequest.updated_by : (previousTimeframe === null ? prevData.updated_by : previousTimeframe.user_id)
            }
            await Timeframe.createProjectTimeframe(inputRequestTimeFrame);
            console.log('[INFO]: success create new time frame');
        }
        // end time frame manipulation //

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Memperbarui data di tabel PM_Project: ${inputRequest.id}`
        );
    }

    static async provideDelete(projectId, AuthUser) {
        const existedProject = await Project.findById(projectId);
        if (!existedProject) {
            throw new CustomError("Failed delete data, data not found", 400)
        }

        const existedProjectAssignment = await ProjectAssigment.findFirstByProjectId(projectId);
        if (existedProjectAssignment !== null) {
            throw new CustomError('failed delete data, data is still reference to another relations', 400)
        }

        await Project.delete(projectId);

        // Create activity log data
        const createLogs = await createLog(
            AuthUser.id,
            `Menghapus data dari tabel PM_Project: ${projectId}`
        );
    }
}

module.exports = ProjectService;