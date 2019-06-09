const router = require('express').Router();
const service = require('./orders.service');
const JSONStream = require('JSONStream');
const socket = require('socket.io-client');
const authenticateUser = require('./orders.auth.helper').authenticateUser;

router.use('/', authenticateUser);

router.post('/', (request, response, next) => {
    console.log("inside orders-post");
    const promise = service.createOrder(request.body, request.query.userId);
    promise.then(success => returnSuccessResponse(success, response))
    .catch(errorDetails => next(returnError(errorDetails)));
});

router.put('/:orderId', (request, response, next) => {
    console.log("inside orders-put");
    const promise = service.updateOrder(request.body, request.params.orderId);
    promise.then(success => returnSuccessResponse(success, response))
    .catch(errorDetails => next(returnError(errorDetails)));
});

router.get('/', (request, response, next) => {
    const promise = service.getorders(request.query.userId);
    promise.then(success => returnSuccessResponse(success, response))
    .catch(errorDetails => next(returnError(errorDetails)));
});

router.put('/manage/:orderIds', (request, response, next) => {
    const promise = service.multiUpdate(request.params.orderIds, request.body.userId, request.body);
    promise.then(success => returnSuccessResponse(success, response))
    .catch(reason => next(returnError(reason)));
});

router.delete('/', (request, response, next) => {
    let idArray;
    if(request.query.orderId && request.query.orderId.indexOf(',') > 1) {
        idArray = request.query.orderId.split(',');
    } else if(request.query.orderId){
        idArray = [request.query.orderId];
    } else {
        next(returnError({message: 'invalid data', status: 400}))
    }
    const promise = service.deleteorders(idArray, request.body.userId);
    promise.then(success => returnSuccessResponse(success, response))
    .catch(reason => next(returnError(reason)));
});

router.get('/favorites', (request, response, next) => {
    const promise = service.getFavoriteorders(request.query.userId);
    promise.then(success => {
        returnSuccessResponse(success, response)
    }).catch(reason => next(returnError(reason)))
});

router.get('/search', (request, response, next) => {
    const promise = service.searchByTitle(request.query.userId, request.query.title);
    promise.then(success => {
        returnSuccessResponse(success, response)
    }).catch(reason => next(returnError(reason)))
});

router.get('/group', (request, response, next) => {
    const promise = service.filterorders(request.query.userId, request.query.category);
    promise.then(success => {
        returnSuccessResponse(success, response)
    }).catch(reason => next(returnError(reason)))
});

router.post('/share', (request, response, next) => {
    console.log("inside orders-share");
    const promise = service.shareOrder(request.body, request.query.recipientId);
    promise.then(success => returnSuccessResponse(success, response))
    .catch(errorDetails => next(returnError(errorDetails)));
});

router.get('/shared', (request, response, next) => {
    const promise = service.getSharedorders(request.query.userId);
    promise.then(success => {
        returnSuccessResponse(success, response)
    }).catch(reason => next(returnError(reason)))
});

router.get('/stream', (request, response, next) => {
    const cursor = service.streamorders();
    cursor.on('error', error => next(returnError({status: 500, message: {message: error.message}})));
    cursor.pipe(JSONStream.stringify()).pipe(response.type('json'));
});

router.post('/stream', (request, response, next) => {
    const promise = service.uploadorders();
    promise.then(success => {
        success.data.pipe(JSONStream.parse('*')).pipe(response);
    }).catch(reason => next(returnError(reason)));
});

router.post('/shares', (request, response, next) => {
    const promise = service.shareorders(request.body.username, request.query.user, request.body.items);
    promise.then(success => {
        const client = socket('http://localhost:3000');
        client.emit('logmein', request.body.username);
        client.emit('share', {
            sender: request.body.username,
            receiver: success.data.receiver,
            orders: success.data.orders,
            message: `Hey! ${request.body.username} has shared you orders`
        });
        returnSuccessResponse(success, response);
    }).catch(reason => next(returnError(reason)));
});

function returnError(reason) {
    const error = new Error();
    error.message = reason.message;
    error.status = reason.status;
    return error;
}

function returnSuccessResponse(success, response) {
    const data = success.data;
    response.setHeader('Content-Type', 'application/json');
    response.status(success.status).json(data);
}

module.exports = router;