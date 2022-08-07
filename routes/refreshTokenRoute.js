const express = require('express');
const { handleRefreshToken } = require('../controllers/refreshTokenController');

const refreshTokenRoutes = express();

refreshTokenRoutes.get('/refresh-token', handleRefreshToken);

module.exports = { refreshTokenRoutes }