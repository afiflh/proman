const { TaskListModel } = require("../../models");
const { DateFormatter } = require("../../utils");

const Tasklist = new TaskListModel();

class ReportRewriteTaskService {
    static async provideGetRewriteTask(projectId) {
        let dataTaskByProject = await Tasklist.findByProjectID(projectId);
        dataTaskByProject = dataTaskByProject.map(item => {
            return {
                tasklist_code: item.kode,
                tasklist_title: item.title,
                tasklist_due_date: DateFormatter.formatDateNoTime(item.duedate),
                tasklist_assignee: item.assignee,
                tasklist_project_id: item.project_id,
                tasklist_rewrite_count: item.rewrite_status_count
            }
        })

        return dataTaskByProject;
    }
}

module.exports = ReportRewriteTaskService;