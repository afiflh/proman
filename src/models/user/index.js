const PostgresConnection = require("../../utils/databasePgConnection");
const _ = require("lodash");
const DateFormatter = require("../../utils/dateTime");

class UserModel {
  constructor() {
    this.db = new PostgresConnection();
  }

  async isConnect() {
    try {

      return true;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findUserLoggedIn(userId) {
    try {
      const sql = ` SELECT *
                    FROM users u 
                    WHERE u.id = $1`;
      const params = [userId];
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findWithGroupById(id) {
    try {
      const sql = ` SELECT * FROM users 
                    JOIN "groups" ON users.group_id = "groups".id
                    WHERE users.id = $1
                    ORDER BY users.updated_time DESC`
      const params = [id];
      const result = await this.db.query(sql, params);

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findByEmail(email) {
    const sql = `SELECT u.name, u.secret_key, u.reset_password_token, u.reset_password_token_expires, u.secret_key, u.is_login, u.device_id, u.id, u.phone_number, u.email FROM users u WHERE u.email = $1`;
    const params = [email];
    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findByQueryName(name) {
    const sql = `select * from users u 
                 where  u."name" like $1`
    const params = [`%${name}%`];
    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findAllWithGroup() {
    const sql = `
        SELECT 
          u.id, 
          u.name, 
          g.description AS group_name, 
          u.group_id,
          u.last_login, 
          u.last_logout, 
          u.is_login, 
          u.is_active, 
          u.created_by, 
          (SELECT name FROM users WHERE id = u.created_by) AS created_by_name, 
          u.created_time, 
          u.updated_by, 
          (SELECT name FROM users WHERE id = u.updated_by) AS updated_by_name, 
          u.phone_number, 
          u.email
        FROM 
          users u
        LEFT JOIN 
          groups g ON u.group_id = g.id
        ORDER BY 
          u.name ASC; `;
    try {
      const result = await this.db.query(sql);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findByCredentials(userId, secretKey) {
    const sql = `SELECT * FROM users 
                 JOIN "groups" ON users.group_id = "groups".id
                 WHERE users.id = $1 AND secret_key = $2
                 ORDER BY users.updated_time DESC
                 `;
    const params = [userId, secretKey];
    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findUserGroup(userId) {
    try {
      const sql = `SELECT * FROM users 
      JOIN "groups" ON users.group_id = "groups".id
      WHERE users.id = $1
      ORDER BY users.updated_time DESC
      `;
      const params = [userId];
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async getMenuList(menuList) {


    const menuListArray = menuList.split(",").map(Number);
    const placeholders = menuListArray.map((_, i) => `$${i + 1}`).join(",");

    const sql = `SELECT *
                 FROM menu
                 WHERE id IN (${placeholders}) AND is_active = '1'
                 ORDER BY order_by ASC`;
    const params = menuListArray;
    try {
      const result = await this.db.query(sql, params);
      const organizedMenuList = this.organizeMenuHierarchy(result);
      return organizedMenuList;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async organizeMenuHierarchy(menuList) {
    const menuMap = _.keyBy(menuList, "id");
    const rootMenus = [];

    menuList.forEach((item) => {
      if (item.parent_id) {
        const parent = menuMap[item.parent_id];
        if (parent) {
          parent.child = parent.child || [];
          parent.child.push(item);
        }
      } else {
        rootMenus.push(item);
      }
    });

    function filterMenu(menu) {
      return menu.map((item) => {
        const filteredItem = {
          name: item.name,
          url: item.url,
        };
        if (item.child) {
          filteredItem.child = filterMenu(item.child);
        } else {
          filteredItem.child = [];
        }
        return filteredItem;
      });
    }

    return filterMenu(rootMenus);
  }

  async create(inputRequest) {

    const sql = `INSERT INTO users (id, name, secret_key, group_id, last_login, last_logout, is_login, is_active, created_by, created_time, failed_attempt, phone_number, email) 
                 VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                `;
    const params = [
      inputRequest.id,
      inputRequest.name,
      inputRequest.secret_key,
      inputRequest.group_id,
      inputRequest.last_login,
      inputRequest.last_logout,
      inputRequest.is_login,
      inputRequest.is_active,
      inputRequest.created_by,
      inputRequest.created_time,
      inputRequest.failed_attempt,
      inputRequest.phone_number,
      inputRequest.email,
    ];
    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async createDirect(inputRequest) {

    const sql = `INSERT INTO users (id, name, group_id, is_active, created_by, created_time, failed_attempt, email) 
                 VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                `;
    const params = [
      inputRequest.id,
      inputRequest.name,
      inputRequest.group_id,
      inputRequest.is_active,
      inputRequest.created_by,
      inputRequest.created_time,
      inputRequest.failed_attempt,
      inputRequest.email,
    ];
    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findByName(name) {

    const sql = `SELECT * FROM users WHERE name = $1`;
    const params = [name];

    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findById(id) {
    const sql = `SELECT * FROM users WHERE id = $1`;
    const params = [id];

    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async update(inputRequest) {

    const sql = `UPDATE users 
                 SET group_id=$1, updated_by=$2, updated_time=$3, is_active=$4, phone_number=$5, email=$6
                 WHERE id=$7
                `;
    const params = [
      inputRequest.group_id,
      inputRequest.updated_by,
      inputRequest.updated_time,
      inputRequest.is_active,
      inputRequest.phone_number,
      inputRequest.email,
      inputRequest.id,
    ];
    try {
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async updateRegistering(inputRequest) {
    try {
      const sql = ` UPDATE users 
                    SET name= $1, secret_key=$3, phone_number=$4
                    WHERE email= $2
                `;
      const params = [
        inputRequest.name,
        inputRequest.email,
        inputRequest.secret_key,
        inputRequest.phone_number,
      ];
      const result = await this.db.query(sql, params);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async updateResetPasswordToken(resetTokenPass, userEmail) {
    try {

      const sql = `
                    UPDATE users 
                    SET 
                      secret_key = $1,
                      reset_password_token = $1,
                      reset_password_token_expires = NOW() + interval '15 minutes'
                    WHERE email = $2;
                  `
      const params = [resetTokenPass, userEmail];
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async updateForgotPassword(userId, newPassword) {
    try {
      const sql = `
                    UPDATE users
                    SET secret_key = $2, 
                        reset_password_token = null,
                        reset_password_token_expires = null
                    WHERE id = $1
                  `;
      const params = [userId, newPassword];
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async updateLogin(isLogin, lastLogin, id, deviceId) {

    const sql = `UPDATE users 
                 SET is_login = $1,
                     last_login = $2,
                     failed_attempt = $3,
                     device_id = $5
                 WHERE id = $4`;
    const params = [isLogin, lastLogin, 0, id, deviceId];

    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async updateFailedAttempt(userId, attempts) {

    const sql = `UPDATE users SET failed_attempt = $1 WHERE id = $2`;
    const params = [attempts, userId];

    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async updateBlock(userId) {

    const sql = `UPDATE users SET is_active = $1 WHERE id = $2`;
    const params = ["0", userId];

    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async updateLogout(userId) {
    const currentDatetime = DateFormatter.dateNow();
    const sql = `UPDATE users SET is_login = '0', device_id = null, last_logout = $1 WHERE id = $2`;
    const params = [currentDatetime, userId];

    try {
      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
  }

  async findAll() {
    const sql = `
        SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.phone_number, 
          u.last_login, 
          u.last_logout, 
          u.is_login, 
          u.is_active, 
          u.created_by, 
          (SELECT name FROM users WHERE id = u.created_by) AS created_by_name, 
          u.created_time , 
          u.updated_by, 
          (SELECT name FROM users WHERE id = u.updated_by) AS updated_by_name, 
          u.updated_time 
        FROM 
          users u
        ORDER BY 
          u.name ASC;
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

  async updatePassword(inputRequest) {
    const sql = `UPDATE users SET secret_key = $1, updated_by = $2, updated_time = NOW() WHERE id = $3`;
    const params = [
      inputRequest.secret_key,
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

  async editProfile(inputRequest) {
    const sql = `UPDATE users SET phone_number = $1, email = $2, secret_key = $3 WHERE id = $4`;
    const params = [
      inputRequest.phone_number,
      inputRequest.email,
      inputRequest.secret_key,
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

}

module.exports = UserModel;
