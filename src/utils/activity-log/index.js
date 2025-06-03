const { ActivityLogModel } = require('../../models');

const activityModel = new ActivityLogModel();

async function createLog(user_id, activity) {
    try {
        const inputRequest = {
            user_id, activity
        }
        
        await activityModel.create(inputRequest)

        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createLog
}