const jwt = require('jsonwebtoken');
const env = require('../config/env');

const login = (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const isValidUser =
        username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD;

    if (!isValidUser) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({ token });
};

module.exports = { login };
