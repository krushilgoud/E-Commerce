const router = require('express').Router();
const service = require('./users.service');
const bcrypt = require('bcrypt-nodejs');
const config = require('../../../config');
const axios = require('axios');
const auth_sign_url = config.AUTH_SIGN

router.post('/login', (request, response, next) => {
    const promise = service.signInUser(request.body);
    promise
        .then(success => {
            console.log("is a success promise");
            bcrypt.compare(request.body.password, success.data.password, (error, isValid) => {
                if(error) {
                    console.log("isError after bcryptCompare :: "+error);
                    next(returnError({message: error.message, status: 500}));
                } else {
                    console.log("isSuccess after bcryptCompare :: "+isValid);
                    if(isValid) {
                        console.log("isValid");
                        axios({
                            method: 'post',
                            url: `${auth_sign_url}`,
                            data: {
                                username: success.data.username,
                                userId: success.data.userId
                            }
                        }).then(http_data => {
                            sendSuccessResponse({
                                data: {
                                    token: http_data.data.token,
                                    user: {
                                        userName: success.data.username,
                                        userId: success.data.userId
                                    }
                                },
                                status: 200
                            }, response);
                        }).catch(error => {
                            console.log("isError during auth api call :: "+error);
                            next(returnError({message: error.message, status: 403}));
                        });
                    } else {
                        console.log("isValid");
                        next(returnError({message: 'Passwords is incorrect', status: 403}));
                    }
                }
            });
        })
        .catch(errorDetails => next(returnError(errorDetails)));
    }
);

router.post('/register', (request, response, next) => {
    const promise = service.registerUser(request.body);
    promise.then(success => sendSuccessResponse(success, response)).catch(regError => {next(returnError(regError))})
    }
);

router.get('/find', (request, response, next) => {
    const promise = service.findUserByUsername(request.query.username);
    promise.then(success => {
        returnSuccessResponse(success, response)
    }).catch(reason => next(returnError(reason)))
})

function returnSuccessResponse(success, response) {
    const data = success.data;
    response.setHeader('Content-Type', 'application/json');
    response.status(success.status).json(data);
}

function returnError(regError) {
    const error = new Error(regError.message);
    error.status = regError.status;
    return error;
}

function sendSuccessResponse(success, response) {
    let data = success.data;
    if(!success.data.user) {
        data.message = success.message;
    }
    response.setHeader('Content-Type', 'application/json');
    response.status(success.status).json(data);
}

module.exports = router;