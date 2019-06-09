const mongoose = require('mongoose');
const MONGO_URL = require('../config/appConfig').MONGO_URL;

const options = { 
    useNewUrlParser: true
};

const createConnection = () => {
    setTimeout(() => mongoose.connect(MONGO_URL, options), 10000);
};
const getConnection = () => {
    return mongoose.connection;
};

const onSuccess = () => {
    console.log('Database connection established');
};

const onError = (error) => {
    console.log('Error establishing DB connection');
    console.log(error);
    createConnection();
};

module.exports = {
    createConnection,
    getConnection,
    onSuccess,
    onError
};