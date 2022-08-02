const dotenv = require('dotenv');
const { response } = require('express');
dotenv.config();
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        res.status(401).json({
            message: 'Token is required',
            success: false
        });
        return;
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decode;
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
    return next();
}

module.exports = {verifyToken};