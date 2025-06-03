const {
    ProjectAssigneeModel,
    UserModel,
    ProjectStatusModel,
    TaskListModel,
    TimeframeModel,
    StatusModel,
    ProjectModel,
    CommentsModel,
} = require("../../models");
const {
    ResponseHandler,
    getSequenceProjectStatus,
    createLog,
    CustomError,
} = require("../../utils");
const { DateFormatter } = require("../../utils");
const { generateUuid } = require("../../utils/uuidGenerator");

const ProjectAssignee = new ProjectAssigneeModel();
const ProjectStatus = new ProjectStatusModel();
const Project = new ProjectModel();
const Tasklist = new TaskListModel();
const Timeframe = new TimeframeModel();
const User = new UserModel();
const Status = new StatusModel();
const Comment = new CommentsModel();

class ProjectAssigneeService {

    static async provideGetAll(userId) {
        const existedUser = await User.findById(userId);
        if (existedUser === null) {
            throw new CustomError("failed fetch data, user not found", 400)
        }
        if (!userId || userId === null) {
            throw new CustomError("failed fetch data, user id is null", 400)
        }

        let data = await ProjectAssignee.findAll(userId.toString());
        data = data.map((item) => {
            return {
                project_id: item.project_id,
                project_name: item.project_name,
                assignee_id: item.assignee,
            };
        });

        return data;
    }

    static async provideGetBoardData(projectId, filterAsigneesName) {
        const currentProject = await Project.findById(projectId);

        // Mengambil data status dari project
        const existedProjectStatus = await ProjectStatus.findByProjectId(projectId);
        if (existedProjectStatus === null) {
            throw new CustomError("failed fetch data, project maybe not defined yet", 400);
        }
        const statusProject = existedProjectStatus.project_status;
        const statusProjectArray = statusProject.split(",");
        let dataStatus = [];
        for (let i = 0; i < statusProjectArray.length; i++) {
            const status = await ProjectAssignee.findStatusProject(statusProjectArray[i]);
            if (status === null) {
                throw new Error("error fetching, data status maybe not defined");
            }
            dataStatus.push({
                status_id: status.status_id,
                status_name: status.status_name,
                status_single_process: status.status_single_process,
                status_mode: status.status_mode,
            });
        }

        let dataAssigneeTasklist = await ProjectAssignee.findTasksliskAssignee(
            projectId,
            filterAsigneesName
        );
        dataAssigneeTasklist = dataAssigneeTasklist.map((item) => {
            return {
                tasklist_code: item.tasklist_code,
                tasklist_title: item.tasklist_title,
                tasklist_assignee_id: item.tasklist_assignee_id,
                tasklist_assignee_name: item.tasklist_assignee_name,
                tasklist_severity: item.tasklist_severity,
                tasklist_duedate: DateFormatter.formatDate(item.tasklist_duedate),
                tasklist_status_id: item.tasklist_status_id,
                tasklist_status_name: item.tasklist_status_name,
                tasklist_status_mode: item.tasklist_status_mode,
            };
        });

        const dataResponse = {
            project_name: currentProject.name ?? null,
            project_status: dataStatus,
            assignee_tasklist: dataAssigneeTasklist,
        };

        return dataResponse;
    }

    static async provideGetBoardDataByTopProject(userData) {
        let projectAssignedToUser = await ProjectAssignee.findAll(userData.id);
        if (projectAssignedToUser.length === 0) {
            return {
                message: "No project assigned to user",
                data: {}
            }
        }

        projectAssignedToUser = await Promise.all(
            projectAssignedToUser.map(async (item) => {
                const projectWithCountTask = await Tasklist.getCountTodoTaskByAssignee(item.assignee_id, item.project_id);
                return projectWithCountTask.project_id ? { ...projectWithCountTask } : { task_count: '0' };
            })
        );

        const topProjectTodo = projectAssignedToUser.reduce(
            (max, obj) => (Number(obj.task_count) > Number(max.task_count) ? obj : max),
            projectAssignedToUser[0]
        );

        if (!topProjectTodo) {
            return {
                message: "Top Todo Project is still null",
                data: {}
            }
        }

        return {
            message: "success fetching data boards",
            data: topProjectTodo
        };
    }

    static async provideGetAssigneeByProject(projectId) {
        const existedProject = await Project.findById(projectId);
        if (!existedProject) {
            throw new CustomError("failed fetch data, project not found", 400)
        }
        if (!projectId || projectId === null) {
            throw new CustomError("failed fetch data, project id is null", 400)
        }

        let data = await ProjectAssignee.findAssigneeByProject(projectId);

        return data;
    }

    static async provideUpdateStatus(bodyRequest, taskCode, AuthUser) {
        // Ambil data status assignment
        const statusAssignment = await Status.findById(bodyRequest.status_id);
        if (!statusAssignment) throw new CustomError("Status not found", 400);

        const existedTasklist = await Tasklist.findCode(taskCode);
        if (existedTasklist === null) {
            throw new CustomError("Failed update tasklist status, tasklist not found!", 400);
        }

        // Cek data single_process dari status assignment
        if (statusAssignment.single_process) {
            const currentTask = await Tasklist.findCode(taskCode);
            if (!currentTask) {
                throw new CustomError("Task not found", 400)
            }

            const currentProject = await Project.findById(currentTask.project_id);
            if (!currentProject) {
                throw new CustomError("Project not found", 400);
            }

            const taskCount = await ProjectAssignee.countTaskSingleProcess(
                currentProject.id,
                existedTasklist.assignee_id,
                statusAssignment.id,
            );

            if (taskCount.result_count > 0) {
                throw new CustomError("Update status task not allowed, task is single process per assignee!", 400);
            }
        }

        const sequenceStatusArray = await getSequenceProjectStatus(existedTasklist.project_id);
        const indexStatusFromInput = sequenceStatusArray.find(
            (item) => item.status === bodyRequest.status_id
        );
        const indexStatusPrevTasklist = sequenceStatusArray.find(
            (item) => item.status === existedTasklist.status_id
        );

        const inputRequest = {
            kode: taskCode,
            status_id: bodyRequest.status_id,
            rewrite_status_count:
                indexStatusFromInput.order_index < indexStatusPrevTasklist.order_index
                    ? existedTasklist.rewrite_status_count + 1
                    : existedTasklist.rewrite_status_count,
        };

        // Pengecekan kondisi jika tasklist ingin mengupdate ke status yang modenya adalah HOLD / '3'
        if (bodyRequest.hold_comment && bodyRequest.hold_comment !== undefined) {
            const inputRequestHoldComment = {
                id: generateUuid(),
                tasklist_id: bodyRequest.task_id,
                subtasklist_id: null,
                comment: bodyRequest.hold_comment,
                comment_mode: "tasklist",
                created_by: "SYSTEM_APP",
            };
            await Comment.create(inputRequestHoldComment);
        }

        await ProjectAssignee.updateStatus(inputRequest);

        const latestTasklist = await Tasklist.findCode(taskCode);
        const latestUserTasklist = await User.findById(latestTasklist.assignee_id);

        // start time frame manipulation //
        const updatedTime = DateFormatter.dateNow();

        const lastTimeframe = await Timeframe.findLastAssignment(taskCode, latestUserTasklist.id);
        if (lastTimeframe !== null) {
            await Timeframe.updateAssignment(lastTimeframe.id, updatedTime);
        }

        const inputRequestTimeframe = {
            project_id: latestTasklist.project_id,
            task_id: latestTasklist.kode,
            previous_status_id: existedTasklist.status_id,
            status_id: latestTasklist.status_id,
            start_time: updatedTime,
            user_id: latestUserTasklist.id,
        };
        await Timeframe.createNewTimeFrameAssignment(inputRequestTimeframe);
        // end time frame manipulation //

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Memperbarui data status di tabel PM_Tasklist: ${inputRequest.status_id} (status_id)`
        );
    }
}

module.exports = ProjectAssigneeService;