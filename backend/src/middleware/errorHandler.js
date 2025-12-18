const env = require('../config/env');

const errorHandler = (err, req, res, _next) => {
    console.error(err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: env.NODE_ENV === 'development' ? err : {},
    });
};

module.exports = errorHandler;