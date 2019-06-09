const jwt = require('jsonwebtoken')
// const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'jwt-secret-key';
// const expiry = process.env.TOKEN_EXPIRE ? process.env.TOKEN_EXPIRE : '1h';

const secret = 'jwt-secret-key';
const expiry = '1h';

const signInToken = (payload, callback) => {
    jwt.sign(payload, secret, {expiresIn: expiry}, (error, token) => callback(error, token));
};

const verifyToken = (token, callback) => {
    jwt.verify(token, secret, (error, payload) => callback(error, payload));
};

module.exports = {
    signInToken,
    verifyToken
}