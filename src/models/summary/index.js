const PostgresConnection = require("../../utils/databasePgConnection");

class SummaryModel {
    constructor() {
        this.db = new PostgresConnection();
    }

    async findLastProjectTimeframe() {
        try {
            const sql = `
                         SELECT * FROM pm_project_time_frame
                         WHERE project_id = $1 AND status_id = $2
                         ORDER BY start_time DESC
                        `;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findAllProjectByStatus(status_data) {
        try {
            const sql = `
                            SELECT pp.id, 
                                pp.name, 
                                pp.description, 
                                pp.start_date, 
                                pp.end_date, 
                                pp.status,
                                (now() - (select pptf.start_time 
                                    from pm_project_time_frame pptf 
                                    where pptf.project_id = pp.id 
                                    order by pptf.start_time desc
                                    limit 1)) as duration,
                                (select pptf.start_time 
                                    from pm_project_time_frame pptf 
                                    where pptf.project_id = pp.id 
                                    order by pptf.start_time desc
                                    limit 1) as start_time_at_param
                            FROM pm_project pp
                            WHERE pp.status = $1
                            ORDER BY duration desc
                        `;
            const params = [status_data];

            const result = await this.db.query(sql, params);
            return result.length > 0 ? result : [];
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findAllProjectBySubStatus(status_data) {
        try {
            const sql = `
                            SELECT pp.id, 
                                pp.name, 
                                pp.description, 
                                pp.start_date, 
                                pp.end_date, 
                                pp.status,
                                (now() - (select pptf.start_time 
                                    from pm_project_time_frame pptf 
                                    where pptf.project_id = pp.id 
                                    order by pptf.start_time desc
                                    limit 1)) as duration,
                                (select pptf.start_time 
                                    from pm_project_time_frame pptf 
                                    where pptf.project_id = pp.id 
                                    order by pptf.start_time desc
                                    limit 1) as start_time_at_param
                            FROM pm_project pp
                            WHERE pp.substatus = $1
                            ORDER BY duration desc
                        `;
            const params = [status_data];

            const result = await this.db.query(sql, params);
            return result.length > 0 ? result : [];
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findAllParameter() {
        try {
            const sql = `
                         SELECT id, data, description FROM pm_parameter WHERE code = 'PROJECT_STATUS'
                        `;
            const result = await this.db.query(sql, []);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async assignmentProgress(assigneeId) {
        const sql = `
            WITH task_summary AS (
                SELECT 
                    pt.project_id,
                    pt.status_id,
                    COUNT(*) AS task_count,
                    SUM(COUNT(*)) OVER (PARTITION BY pt.project_id) AS total_count
                FROM 
                    pm_tasklist pt
                WHERE 
                    pt.assignee_id = $1
                GROUP BY 
                    pt.project_id, pt.status_id
            )
            SELECT 
                ts.project_id, 
                p.name AS project_name, 
                s.id AS status_id,
                s.name AS status_name, 
                ROUND(ts.task_count * 100.0 / ts.total_count, 0) AS percentage
            FROM 
                task_summary ts
            JOIN 
                pm_project p ON ts.project_id = p.id
            JOIN 
                pm_status s ON ts.status_id = s.id
            WHERE p.status = '2'
            ORDER BY 
                p.name;
        `;

        const params = [assigneeId];

        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findHighPrioProjectByAssignee(userid) {
        const sql = `
                    select pp.id, pp."name" as project_name , pp.start_date, pp.end_date, pp.status, array_agg(u."name") as assignee_team
                    from pm_project pp 
                    join pm_project_assignment ppa on ppa.project_id  = pp.id
                    join pm_project_assignment ppa2 on ppa2.project_id  = pp.id
                    join users u on u.id = ppa2.user_assignment 
                    where pp.status in ('1', '3') and ppa.user_assignment = $1 and pp.end_date <= current_date + interval '30 days'
                    group by 
                        pp.id, 
                        pp."name", 
                        pp.start_date, 
                        pp.end_date, 
                        pp.status;
                    `;
        const params = [userid];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async projectProgress() {
        const sql = `
            WITH task_summary AS (
                SELECT 
                    pt.project_id,
                    pt.status_id,
                    COUNT(*) AS task_count,
                    SUM(COUNT(*)) OVER (PARTITION BY pt.project_id) AS total_count
                FROM 
                    pm_tasklist pt
                GROUP BY 
                    pt.project_id, pt.status_id
            )
            SELECT 
                ts.project_id, 
                p.name AS project_name,
                s.id AS status_id, 
                s.name AS status_name, 
                ROUND(ts.task_count * 100.0 / ts.total_count, 0) AS percentage
            FROM 
                task_summary ts
            JOIN 
                pm_project p ON ts.project_id = p.id
            JOIN 
                pm_status s ON ts.status_id = s.id
            WHERE p.status = '2'
            ORDER BY 
                p.name;
        `;

        try {
            const result = await this.db.query(sql);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async getImplementationSubdata() {
        const sql = `
            select *
            from pm_parameter pp 
            where pp."parameter" = (select id from pm_parameter where description = 'IMPLEMENTATION')
            order by pp.id asc
        `;

        try {
            const result = await this.db.query(sql);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }
}

module.exports = SummaryModel;
