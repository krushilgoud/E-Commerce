const signJWTToken = require('./api/jwt').signToken;
const verifyJWTToken = require('./api/jwt').verifyToken;
const initializeMongooseConnection = require('./db').createConnection;

module.exports = {
	signJWTToken,
	verifyJWTToken,
	initializeMongooseConnection
};