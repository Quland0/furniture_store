const ApiError = require('../error/ApiError');
const logger = require('../logger');

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        logger.error(err.message, { stack: err.stack });
        return res.status(err.status).json({ message: err.message });
    }

    logger.error('Непредвиденная ошибка', { message: err.message, stack: err.stack });
    return res.status(500).json({ message: "Непредвиденная ошибка" });
};