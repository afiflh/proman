const { createLogger, format, transports } = require('winston')
const { combine, timestamp, colorize, align, printf, errors } = format
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path')


// format log custom
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return stack ?
        `> ${timestamp} [${level.toUpperCase()}]: ${message} ${stack}` :
        `> ${timestamp} [${level.toUpperCase()}]: ${message}`;
})

// creating logger
const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        logFormat
    ),
    transports: [
        new transports.DailyRotateFile({
            filename: path.join(__dirname, '../../logs/info', 'pm-api-%DATE%.txt'),
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
        }),
        new transports.Console({
        })
    ],
    exceptionHandlers: [
        new DailyRotateFile({
            filename: path.join(__dirname, '../../logs/error-exceptions', 'pm-api-%DATE%-error-except.txt'),
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '10m',
        })
    ]
})

module.exports = logger;

