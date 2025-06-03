const PostgresConnection = require("../../utils/databasePgConnection");

class ReportActivityModel {
  constructor() {
    this.db = new PostgresConnection();
  }

  async getActivities(groupId = null) {
    let sql = `
          SELECT
          u.id as assignee_id,
          u.name as assignee_name,
          g.id as group_id,
          g.description as group_name,
          pt.kode as task_code,
          pt.title as task_title,
          p.id as project_id,
          p.name as project_name,
          ps.id as current_status_id,   
          atf.start_time as start_time
          FROM users u 
          join "groups" g on g.id = u.group_id
          left JOIN pm_assignment_time_frame atf on atf.user_id = u.id
          left join pm_tasklist pt on pt.kode = atf.task_id
          left join pm_project p on p.id = atf.project_id
          right join pm_status ps on ps.id = atf.status_id
          where atf.start_time >= NOW() - INTERVAL '7 days' 
             and ps."mode" = '1' 
        `;
    try {
      if (groupId != undefined || groupId != null) {
        sql += ` and u.group_id = '${groupId}' `;
      }
      const result = await this.db.query(sql);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }
}

module.exports = ReportActivityModel;

