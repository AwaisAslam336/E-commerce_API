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
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decode;
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    return next();
}

module.exports = {verifyToken};