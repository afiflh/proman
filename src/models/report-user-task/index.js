const PostgresConnection = require('../../utils/databasePgConnection');

class ReportUserTaskModel {
    constructor() {
        this.db = new PostgresConnection();
    }

    async store(inputRequest) {
        const sql = `
            INSERT INTO pm_kpi_logs (project_id, task_code, assignee_id, kpi_status_id, prog_date)
            VALUES ($1, $2, $3, $4, NOW())
        `;

        const values = [
            inputRequest.project_id,
            inputRequest.task_code,
            inputRequest.assignee_id,
            inputRequest.kpi_status_id
        ];

        try {
            const result = await this.db.query(sql, values);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findByQuery(projectId = null, mode = null, groupId = null, endDate, startDate) {
        try {
            let sql = `
                        select	u.id as assignee_id,
                                u."name" as assignee_name,
                                putl.task_code, 
                                pt.title as task_title,
                                g.id as group_id,
                                putl.prog_date as progress_date
                        from pm_user_task_logs putl 
                        left join users u on u.id = putl.assignee_id 
                        left join pm_tasklist pt on pt.kode = putl.task_code 
                        left join "groups" g on g.id = putl.group_id 
                        where 
                        ${projectId && mode && groupId ? 'putl.project_id = $3 and putl.mode = $4 and g.id = $5 and' : ''}
                        putl.prog_date between $1 and $2
                       
                        order by putl.prog_date desc                  
                        `;

            let params = projectId && mode && groupId ? [endDate, startDate, projectId, mode, groupId] : [endDate, startDate];

            console.log(sql);
            console.log(params);

            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            throw error
        }
    }

}




module.exports = ReportUserTaskModel;