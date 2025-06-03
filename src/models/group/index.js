const PostgresConnection = require('../../utils/databasePgConnection');
const DateFormatter = require('../../utils/dateTime');

class GroupModel {
  constructor() {
    this.db = new PostgresConnection();
  }

  async findById(id) {
    const sql = `SELECT * FROM groups WHERE id=$1`;
    const params = [id];

    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findAll() {
    const sql = `
      SELECT g.id, g.description, g.is_active, g.menu_list, 
             g.created_by, g.created_time, u1.name AS created_by_name,
             g.updated_by, g.updated_time, u2.name AS updated_by_name
      FROM groups g
      LEFT JOIN users u1 ON g.created_by = u1.id
      LEFT JOIN users u2 ON g.updated_by = u2.id
      ORDER BY g.created_time DESC
    `;
  
    try {
      const result = await this.db.query(sql);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }
  

  async create(data) {
    const sql = `
            INSERT INTO groups (id, description, menu_list, is_active, created_by, created_time)
            VALUES ($1, $2, $3, $4, $5, NOW())
        `;

    const values = [
      data.id,
      data.description,
      data.menu_list,
      data.is_active,
      data.created_by,
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
    const dateNow = DateFormatter.dateNow();
    const sql = `UPDATE groups 
                 SET description=$1, menu_list=$2, is_active=$3, updated_by=$4, updated_time=$5
                 WHERE id=$6`;
    const params = [
      inputRequest.description,
      inputRequest.menu_list,
      inputRequest.is_active,
      inputRequest.updated_by,
      dateNow,
      inputRequest.group_id,
    ];

    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findAllDropdown() {
    const sql = `SELECT id, description
        FROM groups
        WHERE is_active = '1'
        ORDER BY description ASC`;
    try {
      console.log('Fetching all groups active');
      const result = await this.db.query(sql);
      return result;
    } catch (error) {
      await this.db.close();
      console.error('Error fetching all groups:', error);
      throw error;
    }
  }
}

module.exports = GroupModel;
