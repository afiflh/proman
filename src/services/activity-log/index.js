const { ActivityLogModel } = require("../../models");
const { DateFormatter } = require("../../utils");
const ActivityLog = new ActivityLogModel();

class ActivityLogService {
  static async getAllLogs({ limit, offset, search }) {
    let datas = await ActivityLog.getAll({ limit, offset, search });

    datas =
      datas.length > 0
        ? datas.map((item) => {
          return {
            id: item.id,
            user_id: item.user_id,
            activity: item.activity,
            date_time: DateFormatter.formatDate(item.date_time),
          };
        })
        : [];

    const totalDatas = await ActivityLog.getCountAll(search);
    const totalPages = Math.ceil(totalDatas / limit);

    return {
      totalDatas,
      totalPages,
      dataLogs: datas,
    };
  }

  static async getAllLogsToDownload() {
    let datas = await ActivityLog.getAllLimitless();
    datas = datas.map((item) => {
      return {
        id: item.id,
        user_id: item.user_id,
        activity: item.activity,
        date_time: DateFormatter.formatDate(item.date_time),
      };
    });
    return datas;
  }
}

module.exports = ActivityLogService;
