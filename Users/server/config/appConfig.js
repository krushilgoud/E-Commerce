const config = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    AUTH_SIGN: `${process.env.AUTH_BASE_URL}/signin`,
};

// const config = {
//     PORT: 8200,
//     MONGO_URL: `mongodb://localhost:27017/UsersDB`,
//     AUTH_SIGN: `http://localhost:8100/api/v1/auth/signin`,
// };

module.exports = config;