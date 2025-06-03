const cron = require('node-cron');
const postgre = require('pg');
// const { LISTEN_PORT } = require("./src/config/env");
// DB_HOST,
// DB_PORT,
// DB_USER,
// DB_PASSWORD,
// DB_NAME,
const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
} = require('../../../config/env');
const logger = require('../../logger');

const { Pool } = postgre
// Konfigurasi koneksi pool database
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT
})

logger.info('Users tasks job is running...')

async function checkAndInsertKpiLogs() {
    try {
        const tasks = await pool.query(
            `   
                SELECT pt.project_id, pt.kode AS task_code, u.id as assignee_id, ps.mode AS mode, g.id as group_id
                FROM pm_tasklist pt
                JOIN pm_status ps ON pt.status_id = ps.id
                join users u on pt.assignee_id = u.id 
                right join groups g on g.id = u.group_id 
                WHERE ps.mode = '1'
                AND NOT EXISTS (
                    SELECT 1 FROM pm_user_task_logs putl 
                    WHERE putl.task_code = pt.kode 
                    AND putl.prog_date = CURRENT_DATE
                )
         `
        )

        if (tasks.rows.length > 0) {
            const insertValues = tasks.rows.map(task => (`('${task.project_id}', '${task.task_code}', '${task.assignee_id}', CURRENT_DATE, '${task.mode}', '${task.group_id}')`)).join(', ')

            const insertQuery = `
                                    INSERT INTO pm_user_task_logs (project_id, task_code, assignee_id, prog_date, mode, group_id)
                                    VALUES ${insertValues}
                                `;

            await pool.query(insertQuery);
            console.log(`Inserted ${tasks.rows.length} KPI logs`)
            logger.info(`Users tasks jobs: success insert ${tasks.rows.length} data to pm_kpi_logs`)
        }
    } catch (error) {
        logger.error(`Error while checking and inserting KPI logs:`, { stack: error.stack })
    }
}

cron.schedule('54 10 * * *', checkAndInsertKpiLogs, {
    timezone: 'Asia/Jakarta'
});