const { TimeframeModel } = require("../../models");
const { ResponseHandler, DateFormatter } = require("../../utils");

const Timeframe = new TimeframeModel()

class ReportTimeframeProjectService {
    static async provideGetReportProject(projectId) {
        let datas = await Timeframe.getReportProjecTimeframe(projectId);

        console.log("datas: ", datas);

        datas = datas.map(item => {
            return {
                project_id: item.project_id,
                project_name: item.project_name,
                previous_status_id: item.previous_status_id,
                previous_status_name: item.previous_status_name,
                status_id: item.status_id,
                status_name: item.status_name,
                start_time: item.start_time ? DateFormatter.formatDate(item.start_time) : null,
                end_time: item.end_time ? DateFormatter.formatDate(item.end_time) : null,
                duration: DateFormatter.formatDuration(item.duration),
                followed_up_by: item.followed_up_by,
                followed_up_by_name: item.followed_up_by_name
            };
        })

        return datas;
    }

    static async provideGetReportAssignment(projectId) {
        let datas = await Timeframe.findAllAssignmentByProject(projectId);
        datas = datas.map(item => {
            return {
                project_id: item.project_id,
                project_name: item.project_name,
                task_id: item.task_id,
                task_name: item.task_name,
                status_id: item.status_id,
                previous_status_id: item.previous_status_id,
                start_time: item.start_time ? DateFormatter.formatDate(item.start_time) : null,
                end_time: item.end_time ? DateFormatter.formatDate(item.end_time) : null,
                duration: DateFormatter.formatDuration(item.duration),
                followed_up_by: item.followed_up_by,
                followed_up_by_name: item.followed_up_by_name,
            };

        })

        return datas;
    }
}

module.exports = ReportTimeframeProjectService;