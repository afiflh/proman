const PostgresConnection = require("../../utils/databasePgConnection");

class ProjectStatusModel {
  constructor() {
    this.db = new PostgresConnection();
  }

  async isUsedStatus(statusId) {
    try {
      const sql = `
        SELECT * 
        FROM pm_project_status pps 
        WHERE pps.project_status LIKE $1
      `;
      const params = [`%${statusId}%`];

      const result = await this.db.query(sql, params);
      return result.length > 0 ? true : false;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findStatusByProject(project_id) {
    try {
      const sql = `SELECT project_status
                   from pm_project_status pps
                   where pps.project_id = $1
                  `
      const params = [project_id];

      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findAll() {
      const sql = `SELECT 
                    pps.id,
                    pps.project_id, 
                    pp.name AS project_name, 
                    pp.description AS description, 
                    pps.project_status,
                    pps.created_by, 
                    u1.name AS created_by_name, 
                    pps.created_at, 
                    pps.updated_by, 
                    u2.name AS updated_by_name, 
                    pps.updated_at,
                    STRING_AGG(u.name, ',') AS username
                  FROM pm_project_status pps
                  JOIN pm_project pp ON pp.id = pps.project_id
                  JOIN pm_project_assignment a ON a.project_id = pps.project_id
                  JOIN users u ON u.id = a.user_assignment
                  LEFT JOIN users u1 ON pps.created_by = u1.id
                  LEFT JOIN users u2 ON pps.updated_by = u2.id
                  GROUP BY pps.id, pp.name, pp.description, u1.name, u2.name
                  ORDER BY pp.name ASC;
              `;

    const params = [];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findByProjectId(id) {
    const sql = `SELECT * FROM pm_project_status WHERE project_id=$1`;

    const params = [id];
    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findById(id) {
    const sql = `SELECT * FROM pm_project_status WHERE id=$1`;
    const params = [id];
    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async create(inputRequest) {
    const sql = `INSERT INTO pm_project_status 
                 (id, project_id, project_status, created_by, created_at, updated_by, updated_at) 
                 VALUES ($1, $2, $3, $4, NOW(), $5, NOW())`;

    const values = [
      inputRequest.id,
      inputRequest.project_id,
      inputRequest.project_status,
      inputRequest.created_by,
      inputRequest.updated_by,
    ];

    try {
      const result = await this.db.query(sql, values);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async update(inputRequest) {
    const sql = `UPDATE pm_project_status
                 SET project_status=$1, updated_by=$2, updated_at=NOW()
                 WHERE id=$3
                `;
    const params = [
      inputRequest.project_status,
      inputRequest.updated_by,
      inputRequest.id,
    ];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async delete(id) {
    const sql = `DELETE FROM pm_project_status WHERE id=$1`;
    const params = [id];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }
}

module.exports = ProjectStatusModel;
