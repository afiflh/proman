const { ResponseHandler, logger } = require('../../utils')

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err?.statusCode ? err.statusCode : 500;
    const message = err?.message ? err.message : 'Internal server error';

    const { method, url, ip } = req;

    logger.error(`METHOD=${method}, URL=${url}, IP=${ip},`, { stack: err.stack });

    console.error(err);
    return ResponseHandler.error(res, message, err, statusCode);
}

module.exports = errorMiddleware