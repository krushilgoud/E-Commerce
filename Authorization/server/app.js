const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();
const api = require('./api');

app.use(cors());
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use('/api', api);

app.use((request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.status(404).json('Not found');
});
app.use((error, request, response, next) => {
    response.setHeader('Content-Type', 'application/json');
    response.status(error.status).json({message: error.message});
});

module.exports = app;