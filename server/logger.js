const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack || ''}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, 'logs', 'error.log') }),
        new winston.transports.Console()
    ]
});

module.exports = logger;