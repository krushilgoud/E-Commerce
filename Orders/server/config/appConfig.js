const config = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    AUTH_VERIFY: `${process.env.AUTH_BASE_URL}/verify`
};

// const config = {
//     PORT: 8300,
//     MONGO_URL: `mongodb://localhost:27017/ordersDB`,
//     AUTH_VERIFY: `http://localhost:8100/api/v1/auth/verify`,
// };

module.exports = config;