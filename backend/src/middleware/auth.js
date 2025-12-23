const jwt = require('jsonwebtoken');
const env = require('../config/env');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length)
        : null;

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        req.user = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = auth;
