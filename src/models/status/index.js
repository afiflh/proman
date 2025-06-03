const PostgresConnection = require("../../utils/databasePgConnection");

class StatusModel {
  constructor() {
    this.db = new PostgresConnection();
  }

  async findAll() {
    const sql = ` SELECT 
                    ps.*, 
                    u.name AS created_by_name
                  FROM 
                    pm_status ps
                  LEFT JOIN 
                    users u ON ps.created_by = u.id
                  ORDER BY 
                    ps.name ASC `;
    try {
      const result = await this.db.query(sql);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findById(id) {
    const sql = `SELECT * FROM pm_status WHERE id = $1`;
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
    const sql = `INSERT INTO pm_status(id, name, description, single_process, single_assigner, mode, created_by, created_time) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `;
    const values = [
      inputRequest.id,
      inputRequest.name,
      inputRequest.description,
      inputRequest.single_process,
      inputRequest.single_assigner,
      inputRequest.mode,
      inputRequest.created_by,
      inputRequest.created_time,
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
    const sql = `UPDATE pm_status SET name = $2, description = $3, single_process = $4, single_assigner = $5 , mode = $6
                 WHERE id = $1`;
    const values = [
      inputRequest.id,
      inputRequest.name,
      inputRequest.description,
      inputRequest.single_process,
      inputRequest.single_assigner,
      inputRequest.mode,
    ];
    try {
      const result = await this.db.query(sql, values);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async delete(id) {
    const sql = `DELETE FROM pm_status WHERE id = $1`;
    const values = [id];
    try {
      const result = await this.db.query(sql, values);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }
}

module.exports = StatusModel;
