const config = require('../../../config');
const axios = require('axios');
const verify_uri = config.AUTH_VERIFY;

const authenticateUser = (request, response, next) => {
    console.log("\n\nInside authenticateUser");
    const bearer = request.get('authorization').replace('Bearer ', '');
    if(bearer === undefined || bearer === null) {
        console.log("empty bearer :: "+bearer);
        response.status(403).send('Unauthorized');
    } else {
        console.log("valid bearer :: "+bearer);
        axios({
            method: 'post',
            url: `${verify_uri}`,
            data: {},
            headers: {
                'Authorization': `${bearer}`
            }
        }).then(authResponse => {
            console.log("isSuccess auth api call");
            if(authResponse.data) {
                console.log("valid authResponse data :: "+JSON.stringify(authResponse.data));
                request.body.userId = authResponse.data.userId;
                request.body.username = authResponse.data.username;
                next();
            } else {
                console.log("invalid authResponse data :: "+authResponse.data);
                response.status(403).send('Unauthorized');
            }
        }).catch(error => {
            console.log("isError during auth api call :: "+error);
            response.status(500).send(error.message);
        });
    }
};

module.exports = {
    authenticateUser
};