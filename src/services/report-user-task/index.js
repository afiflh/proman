const moment = require("moment/moment");
const { TaskListModel, ReportUserTaskModel } = require("../../models");
const { ResponseHandler, DateFormatter, CustomError } = require("../../utils");
const ReportUserTask = new ReportUserTaskModel();

class ReportUserTaskService {
    static async provideGetReport(projectId, mode, groupId, endDate, startDate) {
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        let differentDate = newStartDate - newEndDate;
        differentDate = Math.floor(differentDate / (1000 * 60 * 60 * 24));

        if (differentDate > 30 || differentDate < 7) {
            throw new CustomError('Failed get data reports, date range max 30 and min 7', 400)
        }

        let dataKpi = await ReportUserTask.findByQuery(projectId, mode, groupId, endDate, startDate);
        let dataDates = DateFormatter.generateDateRange(startDate, endDate);

        dataKpi = dataKpi.map(item => {
            return {
                assignee_id: item.assignee_id,
                assignee_name: item.assignee_name,
                task_code: item.task_code,
                task_title: item.task_title,
                group_id: item.group_id,
                progress_date: moment(item.progress_date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            }
        })

        let constructResponse = { kpi_by_dates: {} };

        dataDates.forEach(date => {
            // filter data berdasarkan tanggal yang bersesuaian
            const taskByDate = dataKpi
                .filter(item => item.progress_date.split('T')[0] === date)
                .reduce((acc, item) => {
                    // membuat objek baru jika belum ada data untuk assignee_id yang ada
                    if (!acc[item.assignee_id]) {
                        acc[item.assignee_id] = {
                            project_id: item.project_id,
                            assignee_id: item.assignee_id,
                            assignee_name: item.assignee_name,
                            task_code: item.task_code,
                            task_title: item.task_title,
                            progress_date: item.progress_date.split('T')[0]
                        };
                    } else {
                        // menggabungkan nilai assignee_id yang sudah ada 
                        acc[item.assignee_id].task_code += `,${item.task_code}`;
                        acc[item.assignee_id].task_title += `,${item.task_title}`;
                    }
                    return acc;
                }, {});

            constructResponse.kpi_by_dates[date] = taskByDate;
        });

        return constructResponse;
    }
}

module.exports = ReportUserTaskService;