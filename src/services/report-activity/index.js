const { ReportActivityModel } = require("../../models");
const { DateFormatter } = require("../../utils");

const reportActivity = new ReportActivityModel();

class ReportActivityService {
    static async provideGetReports(groupId) {
        let activities = await reportActivity.getActivities(groupId);
        activities = activities.length < 1 ? [] : activities.map(act => {
            return {
                assignee_id: act.assignee_id,
                assignee_name: act.assignee_name,
                group_id: act.group_id,
                group_name: act.group_name,
                task_code: act.task_code,
                task_title: act.task_title,
                project_id: act.project_id,
                project_name: act.project_name,
                current_status_id: act.current_status_id,
                start_date: DateFormatter.formatDateNoTime(act.start_time)
            }
        })

        const dateRangeLastWeek = DateFormatter.generateDateLast7Days();

        // Mengonstruksi data untuk menghilangkan duplikasi assignee/user
        const uniqueAssignees = [];
        const uniqueData = activities.filter(item => {
            const isDuplicate = uniqueAssignees.includes(item.assignee_id);
            if (!isDuplicate) {
                uniqueAssignees.push(item.assignee_id);
                return true;
            }
            return false;
        });

        // Format data untuk dengan konstruksi JSON yang sesuai
        const formattedData = uniqueData.map(act => {
            return {
                assignee_id: act.assignee_id,
                assignee_name: act.assignee_name,
                assignee_group_id: act.group_id,
                today_activities: Array.from(new Set(
                    activities
                        .filter(act2 => act2.assignee_id === act.assignee_id && act2.start_date == dateRangeLastWeek[0])
                        .map(act3 => { return act3.task_title })
                )).join(','),
                last_week_activities: dateRangeLastWeek.map(date => {
                    return {
                        date: date,
                        is_offday: new Date(date).getDay() === 0 || new Date(date).getDay() === 6 ? true : false,
                        worked_projects: Array.from(new Set(activities
                            .filter(act2 => act2.assignee_id === act.assignee_id && act2.start_date === date)
                            .map(act3 => act3.project_name)))
                            .join(',')
                    }
                })
            }
        });

        return formattedData;
    }
}

module.exports = ReportActivityService