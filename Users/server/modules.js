const initializeMongooseConnection = require('./db').createConnection;
const signJWTToken = require('./api/jwt').signToken;
const verifyJWTToken = require('./api/jwt').verifyToken;

module.exports = {
	initializeMongooseConnection,
	signJWTToken,
	verifyJWTToken
};