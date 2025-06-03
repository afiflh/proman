const PostgresConnection = require("../../utils/databasePgConnection");

class TaskListModel {
    constructor() {
        this.db = new PostgresConnection();
    }

    async getCountByStatus(project_id, status_id) {
        const sql = `
                     select count(pt.status_id) as status_count
                     from pm_tasklist pt 
                     where pt.project_id = $1 and pt.status_id = $2
                    `;
        const params = [project_id, status_id];
        try {
            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0].status_count : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async getCountTodoTaskByAssignee(assigneeId, projectId) {
        try {
            const sql = ` 
                            select count( pt.kode ) as task_count, pt.project_id, pp."name" as project_name
                            from pm_tasklist pt 
                            join pm_project pp on pp.id = pt.project_id
                            where pt.assignee_id = $1 and pt.project_id = $2 and pt.status_id = 'TODO'
                            group by pt.project_id, pp."name" 
                        `;
            const params = [assigneeId, projectId];
            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : 0;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findByProjectandStatus(projectId, statusId) {
        const sql = `
            select * from pm_tasklist pt 
            where pt.project_id = $1 and pt.status_id = $2
        `;
        const params = [projectId, statusId];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findAssigneeByProjectAndName(projectId, assignee) {
        const sql = `
        select pt.assignee
        from pm_tasklist pt 
        where pt.project_id = $1 and pt.assignee = $2;
    `;
        const params = [projectId, assignee];
        try {
            const result = await this.db.query(sql, params);
            return result.length > 0 ? result : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findAssigneeByProject(projectId) {
        const sql = `
            select pt.assignee
            from pm_tasklist pt 
            where pt.project_id = $1;
        `;
        const params = [projectId];
        try {
            const result = await this.db.query(sql, params);
            return result.length > 0 ? result : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findAll(created_by) {
        const sql = `SELECT 
                        pt.*, 
                        u1.name AS created_by_name,
                        u2.name AS updated_by_name
                    FROM 
                        pm_tasklist pt
                    LEFT JOIN 
                        users u1 ON pt.created_by = u1.id
                    LEFT JOIN 
                        users u2 ON pt.updated_by = u2.id
                    WHERE 
                        pt.created_by = $1;`;
        const params = [created_by];
        try {
            const result = await this.db.query(sql, params);
            return result
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }


    async findByProjectID(project_id) {
        const sql = `SELECT 
                        pt.kode, 
                        pt.title, 
                        pt.description, 
                        pt.attachment, 
                        pt.duedate, 
                        pt.assignee_id, 
                        u3.name as assignee,
                        pt.project_id,
                        pt.task_severity,
                        pt.rewrite_status_count, 
                        pt.created_by, 
                        u.name as created_by_name, 
                        pt.updated_by, 
                        u2.name AS updated_by_name, 
                        pt.business_analyst
                    FROM 
                        pm_tasklist pt
                    left JOIN users u on u.id = pt.created_by
                    left JOIN users u2 on u2.id = pt.updated_by
                    left JOIN users u3 on u3.id = pt.assignee_id
                    where pt.project_id = $1
                    GROUP BY 
                        pt.kode, 
                        u.name, 
                        u2.name,
                        u3.name
                    ORDER BY 
                        pt.kode asc;`;

        const params = [project_id];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async findCode(kode) {
        const sql =
            `  SELECT 
                    pt.kode,
                    pt.title,
                    pt.description, 
                    pt.attachment, 
                    pt.duedate, 
                    pt.project_id, 
                    pt.assignee_id,
                    u."name" as "assignee_name",
                    pt.created_by,
                    pt.updated_by,
                    pt.status_id,
                    pt.rewrite_status_count,
                    pt.business_analyst,
                    pt.task_severity,
                    pp.id as project_id,
                    pp."name" as project_name
                FROM pm_tasklist pt
                join users u on u.id = pt.assignee_id 
                join pm_project pp on pp.id = pt.project_id 
                WHERE pt.kode = $1`;
        const params = [kode];
        try {
            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async create(inputRequest) {
        const sql = `INSERT INTO pm_tasklist (kode, title, description, attachment, duedate, project_id, assignee_id, created_by, status_id, business_analyst, task_severity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
        const params = [
            inputRequest.kode,
            inputRequest.title,
            inputRequest.description,
            inputRequest.attachment,
            inputRequest.duedate,
            inputRequest.project_id,
            inputRequest.assignee,
            inputRequest.created_by,
            inputRequest.status_id,
            inputRequest.business_analyst,
            inputRequest.task_severity
        ];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async update(inputRequest) {
        const sql = `UPDATE pm_tasklist SET title=$2, description=$3, attachment=$4, duedate=$5, assignee_id=$6, project_id=$7, updated_by=$8, business_analyst=$9, task_severity=$10 WHERE kode=$1`;
        const params = [
            inputRequest.kode,
            inputRequest.title,
            inputRequest.description,
            inputRequest.attachment,
            inputRequest.duedate,
            inputRequest.assignee,
            inputRequest.project_id,
            inputRequest.updated_by,
            inputRequest.business_analyst,
            inputRequest.task_severity
        ];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }

    async updateAssignee(inputRequest) {
        const sql = `UPDATE pm_tasklist SET assignee_id=$1 WHERE kode=$2`;
        const params = [inputRequest.assignee, inputRequest.kode];
        try {
            const result = await this.db.query(sql, params);
            return result;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }
}

module.exports = TaskListModel;
