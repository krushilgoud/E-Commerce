const router = require('express').Router();
const service = require('./jwt.auth.service');

router.post('/signin', (request, response, next) => {
    console.log("\n\nInside signin with req body :: "+JSON.stringify(request.body));
    service.signInToken(request.body, (error, token) => {
        if(error) {
            console.log("isError while signin :: "+error);
            next(returnError({message: error.message,status: 500}));
        } else {
            console.log("isSuccess with token :: "+token);
            response.status(200).json({token:token})
        }
    });
});

router.post('/verify', (request, response, next) => {
    console.log("\n\nInside verify");
    const token = request.get('authorization').replace('Bearer ', '');
    console.log("token :: "+token);
    service.verifyToken(token, (error, payload) => {
        console.log("inside verify service");
        if(error) {
            console.log("isError during verify :: "+error);
            next(returnError({message: error.message,status: 500}));
        } else {
            payload.isAuthenticated = true;
            console.log("isSuccess during verify :: "+JSON.stringify(payload));
            response.status(200).json(payload)
        }
    });
});

function returnError(errorDetails) {
    const error = new Error(errorDetails.message);
    error.status = errorDetails.status;
    return error;
}

module.exports = router;