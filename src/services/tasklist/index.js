const { StatusModel, TaskListModel, ProjectModel, ProjectStatusModel, UserModel, TimeframeModel, ReportUserTaskModel } = require("../../models");
const { ResponseHandler, sendEmail, sendWhatsAppMessage, createLog, CustomError, logger } = require("../../utils");
const { generateCode } = require("../../utils/generateCode");
const { DateFormatter } = require('../../utils');
const { dateNow } = require("../../utils/dateTime");

const TaskList = new TaskListModel();
const Project = new ProjectModel();
const ProjectStatus = new ProjectStatusModel();
const User = new UserModel();
const Timeframe = new TimeframeModel();
const Status = new StatusModel();

class TasklistService {
    static async sendNotification(email, phoneNumber) { };

    static async provideGetDetail(tasklistCode) {
        let datas = await TaskList.findCode(tasklistCode);

        if (datas === null) {
            throw new CustomError("error fetching data, data tasklist not found", 400)
        }
        datas.project_manager = datas.updated_by ? datas.updated_by : datas.created_by;
        return datas;
    }

    static async provideGetAll(userId) {
        const taskLists = await TaskList.findAll(userId);
        console.log(taskLists);
        const formattedTaskLists = taskLists.map(task => {
            task.project_manager_name = task.updated_by_name ? task.updated_by_name : task.created_by_name;
            return task;
        });
        return formattedTaskLists;
    }

    static async provideGetByProjectById(projectId) {
        const taskLists = await TaskList.findByProjectID(projectId);
        if (taskLists.length === 0) {
            throw new CustomError("No task lists found for the selected project", 400)
        }

        const formattedTaskLists = taskLists.map(task => {
            const project_manager = task.updated_by ? task.updated_by : task.created_by;
            const formattedDueDate = DateFormatter.formatDateNoTime(task.duedate);
            const project_manager_name = task.updated_by ? task.updated_by_name : task.created_by_name;

            return {
                ...task,
                project_manager,
                project_manager_name,
                duedate: formattedDueDate,
                created_by_name: task.created_by_name,
                updated_by_name: task.updated_by_name
            };
        });

        return formattedTaskLists;
    }

    static async provideStore(bodyRequest, AuthUser) {
        const assignedUser = await User.findById(bodyRequest.assignee);
        if (assignedUser === null) {
            throw new CustomError('failed create tasklist, assigned user not found', 400)
        }

        const project = await Project.findById(bodyRequest.project_id);
        if (project === null) {
            throw new CustomError("Project not found", 400)
        }

        const projectDueDate = new Date(project.end_date.toISOString().split('T')[0])

        if(new Date() > projectDueDate) {
            throw new CustomError('failed create tasklist, due date of project has passed', 400)
        }

        let projectStatus = await ProjectStatus.findByProjectId(project.id);
        projectStatus = projectStatus.project_status.split(",");

        let generatedCode = generateCode(project.name);
        let existingCode = await TaskList.findCode(generatedCode);
        while (existingCode) {
            generatedCode = generateCode(project.name);
            existingCode = await TaskList.findCode(generatedCode);
        }

        const inputRequest = {
            kode: generatedCode,
            title: bodyRequest.title,
            description: bodyRequest.description,
            attachment: bodyRequest.attachment,
            duedate: bodyRequest.duedate,
            project_id: bodyRequest.project_id,
            assignee: bodyRequest.assignee,
            created_by: bodyRequest.created_by,
            status_id: projectStatus[0],
            business_analyst: bodyRequest.business_analyst,
            task_severity: bodyRequest.task_severity
        };
        await TaskList.create(inputRequest);

        // Mengecek apakah status awal dari project menerapkan KPI
        // Jika implement KPI, maka insert data ke tabel pm_kpi_logs dengan input-input berikut
        // const firstProjectStatus = await Status.findById(projectStatus[0])
        // if (firstProjectStatus.mode === '') {
        //   const inputDatas = {
        //     project_id: bodyRequest.project_id,
        //     task_code: inputRequest.kode,
        //     assignee_id: assignedUser.id,
        //     kpi_status_id: firstProjectStatus.id
        //   }
        //   await ReportUserTask.store(inputDatas)
        // }

        const latestTasklist = await TaskList.findCode(inputRequest.kode);
        if (latestTasklist === null) {
            throw new CustomError('failed create tasklist, latest tasklist not found', 400)
        }
        const assignedProject = await Project.findById(latestTasklist.project_id);
        if (assignedProject === null) {
            throw new CustomError('failed create tasklist, assigned project not found', 400)
        }

        let messageToAssignedUser = '';
        if (assignedUser.email !== null) {
            const subject = `Assignment Task ${inputRequest.title} from Project ${assignedProject.name} (Task Code: ${inputRequest.kode})`;
            messageToAssignedUser = `
            <b>Dear Team,</b><br><br>You are assigned to Task <b>${inputRequest.title}</b> (Task Code: ${inputRequest.kode}) from Project <b>${assignedProject.name}</b><br><br>
            `;
            const responseSendEmail = await sendEmail({ subject, email: assignedUser.email, message: messageToAssignedUser });
            console.log(`[INFO]: Status-code sending email to ${assignedUser.email}: ${responseSendEmail.statusCode}`);
            console.log(`[INFO]: Data response from sending email to ${assignedUser.email}: ${responseSendEmail.data}`)
        }
        if (assignedUser.phone_number !== null) {
            messageToAssignedUser = `
            *Dear Team,*\n\nYou are assigned to Task *${inputRequest.title}* (Task Code: ${inputRequest.kode}) from Project *${assignedProject.name}*\n\n
            `;
            const responseSendWhatsapp = await sendWhatsAppMessage({ message: messageToAssignedUser, phone: assignedUser.phone_number });
            console.log(`[INFO]: Status-code sending whatsapp to ${assignedUser.phone_number}: ${responseSendWhatsapp.statusCode}`);
            console.log(`[INFO]: Data response from sending whatsapp to ${assignedUser.phone_number}: ${responseSendWhatsapp.data}`)
        }

        // start manipulation time frame
        const inputRequestTimeFrame = {
            project_id: project.id,
            task_id: latestTasklist.kode,
            status_id: latestTasklist.status_id,
            previous_status_id: null,
            start_time: DateFormatter.dateNow(),
            user_id: assignedUser.id
        }
        await Timeframe.createNewTimeFrameAssignment(inputRequestTimeFrame);
        // end manipulation time frame

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Menambahkan data baru ke tabel PM_Tasklist: ${inputRequest.kode}`
        );
    }


    static async provideUpdate(bodyRequest, tasklistCode, AuthUser) {
        const prevData = await TaskList.findCode(tasklistCode);
        if (!prevData) {
            throw new CustomError("Failed to update tasklist data, data not found", 400)
        }

        const inputRequest = {
            kode: tasklistCode,
            title: bodyRequest.title ?? prevData.title,
            description: bodyRequest.description ?? prevData.description,
            attachment: bodyRequest.attachment ?? prevData.attachment,
            duedate: bodyRequest.duedate ?? prevData.duedate,
            assignee: bodyRequest.assignee ?? prevData.assignee_id,
            project_id: bodyRequest.project_id ?? prevData.project_id,
            updated_by: bodyRequest.updated_by ?? prevData.updated_by,
            business_analyst: bodyRequest.business_analyst ?? prevData.business_analyst,
            task_severity: bodyRequest.task_severity ?? prevData.task_severity
        };

        await TaskList.update(inputRequest);

        // start time frame manipulation //
        if (prevData.assignee !== bodyRequest.assignee) {
            const updatedTime = DateFormatter.dateNow()

            const oldUserTasklist = await User.findById(prevData.assignee_id);
            const lastTimeframe = await Timeframe.findLastAssignment(prevData.kode, oldUserTasklist.id);
            if (lastTimeframe !== null) {
                await Timeframe.updateAssignment(lastTimeframe.id, updatedTime);
                console.log('[INFO]: success update previous time frame');
            }

            const latestUserTasklist = await User.findById(bodyRequest.assignee);

            await this._sendNotificationUpdateAssignee(latestUserTasklist.email, latestUserTasklist.phone_number, prevData)

            const inputRequestTimeFrame = {
                project_id: prevData.project_id,
                task_id: prevData.kode,
                status_id: prevData.status_id,
                previous_status_id: prevData.status_id,
                start_time: updatedTime,
                user_id: latestUserTasklist.id
            }
            await Timeframe.createNewTimeFrameAssignment(inputRequestTimeFrame);
            console.log('[INFO]: success create new time frame');
        }
        // end time frame manipulation //

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Memperbarui data di tabel PM_Tasklist: ${tasklistCode}`
        );
    }

    static async provideUpdateAssignee(bodyRequest, tasklistCode, AuthUser) {
        const prevData = await TaskList.findCode(tasklistCode);
        if (prevData === null) {
            throw new CustomError('Failed update assignee, tasklist data not found!', 400)
        }

        const statusData = await Status.findById(prevData.status_id);
        if (statusData === null) {
            throw new CustomError('Failed update assignee, status data not found!', 400)
        }

        if (statusData.single_assigner) {
            throw new CustomError('Failed update assignee, status does not allow multiple assignees!', 400)
        }
        const previousAssigneeTask = await User.findById(bodyRequest.assignee);
        if (previousAssigneeTask === null) {
            throw new CustomError('Failed update assignee, user data not found!', 400)
        }

        const inputRequest = {
            kode: tasklistCode,
            assignee: bodyRequest.assignee,
        };
        await TaskList.updateAssignee(inputRequest);

        // start time frame manipulation //
        if (prevData.assignee !== bodyRequest.assignee) {
            const updatedTime = DateFormatter.dateNow()

            const oldUserTasklist = await User.findById(prevData.assignee_id);
            const lastTimeframe = await Timeframe.findLastAssignment(prevData.kode, oldUserTasklist.id);
            if (lastTimeframe !== null) {
                await Timeframe.updateAssignment(lastTimeframe.id, updatedTime);
                console.log('[INFO]: success update previous time frame');
            }

            const latestUserTasklist = await User.findById(bodyRequest.assignee);

            await this._sendNotificationUpdateAssignee(latestUserTasklist.email, latestUserTasklist.phone_number, prevData)

            const inputRequestTimeFrame = {
                project_id: prevData.project_id,
                task_id: prevData.kode,
                status_id: prevData.status_id,
                previous_status_id: prevData.status_id,
                start_time: updatedTime,
                user_id: latestUserTasklist.id
            }
            await Timeframe.createNewTimeFrameAssignment(inputRequestTimeFrame);

            console.log('[INFO]: success create new time frame');
        }
        // end time frame manipulation //

        // Create activity log data <-
        const createLogs = await createLog(
            AuthUser.id,
            `Memperbarui data assignee di tabel PM_Tasklist: ${tasklistCode} | ${inputRequest.assignee} (assignee)`
        );
    }

    static async _sendNotificationUpdateAssignee(email = null, phoneNumber = null, tasklist) {
        if (email) {
            await sendEmail({
                email,
                subject: `Assignment Task ${tasklist.title} from Project ${tasklist.project_name} (Task Code: ${tasklist.kode})`,
                message: `
                    <p>Dear Team,</p>
                    <p>You are assigned to Task <strong>${tasklist.title}</strong> (Task Code: ${tasklist.kode}) from Project <strong>${tasklist.project_name}</strong></p>
                `
            });
        }
        if (phoneNumber) {
            await sendWhatsAppMessage({
                phone: phoneNumber,
                message: `Dear Team, you are assigned to Task *${tasklist.title}* (Task Code: ${tasklist.kode}) from Project *${tasklist.project_name}*`
            });
        }
    }

}

module.exports = TasklistService;