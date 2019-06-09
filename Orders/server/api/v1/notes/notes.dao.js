const Order = require('./orders.entity').ordersModel;
const JSONStream = require('JSONStream');
const fileStream = require('fs');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const DB_URL = require('../../../config').MONGO_URL;
const path = require('path');

const getorders = userID => {
    const promise = new Promise((resolve, reject) => {
        Order.find({userId: userID}, (error, orders) => {
            if(error) {
                reject({message: error.message, status: 500});
            } else {
                resolve({message: 'Retrieved successfully', status: 200, data: orders});
            }
        });
    });
    return promise;
};

const shareOrder = (data, userId) => {
    const promise = new Promise((resolve, reject) => {
        Order.findOne({title: data.title, text: data.text, userId: userId}, (error, order) => {
            if(error) {
                reject({message: error.message, status: 500});
            } else {
                if(order) {
                    reject({message: 'Order already shared', status: 403});
                } else {
                    const order = new Order({
                        title: data.title,
                        text: data.text,
                        state: data.state,
                        group: data.group,
                        userId: userId,
                        createdOn: datify(getFormattedDate()),
                        modifiedOn: datify(getFormattedDate())
                    });
                    if(data.sharedBy !== null || data.sharedBy !== undefined || data.sharedBy !== '') {
                        order.sharedBy = data.sharedBy;
                    }
                    if(data.accessType !== null || data.accessType !== undefined || data.accessType !== '') {
                        order.accessType = data.accessType;
                    }
                    Order.create(order, (error, savedOrder) => {
                        if(error) {
                            reject({message: error.message, status: 500});
                        } else {
                            resolve({message: 'Created', status: 201, data: savedOrder});
                        }
                    });
                }
            }
        });
    });
    return promise;
};

const createOrder = (data, userID) => {
    const promise = new Promise((resolve, reject) => {
        Order.findOne({title: data.title, text: data.text, userId: userID}, (error, order) => {
            if(error) {
                reject({message: error.message, status: 500});
            } else {
                if(order) {
                    reject({message: 'Order already exists', status: 403});
                } else {
                    const order = new Order({
                        title: data.title,
                        text: data.text,
                        state: data.state,
                        userId: userID,
                        createdOn: datify(getFormattedDate()),
                        modifiedOn: datify(getFormattedDate())
                    });
                    if(data.sharedBy !== null || data.sharedBy !== undefined || data.sharedBy !== '') {
                        order.sharedBy = data.sharedBy;
                    }
                    if(data.accessType !== null || data.accessType !== undefined || data.accessType !== '') {
                        order.accessType = data.accessType;
                    }
                    Order.create(order, (error, savedOrder) => {
                        if(error) {
                            reject({message: error.message, status: 500});
                        } else {
                            resolve({message: 'Created', status: 201, data: savedOrder});
                        }
                    });
                }
            }
        });
    });
    return promise;
};

const updateOrder = (order, orderId) => {
    const promise = new Promise((resolve, reject) => {
        order.modifiedOn = datify(getFormattedDate());
        order.id = orderId;
        Order.findOneAndUpdate(
            {
                $and:[
                    {id: orderId},
                    {
                        $or: [
                            {accessType: 'full-access'},
                            {accessType: 'write-only'},
                            {accessType: ''},
                            {accessType: null},
                            {accessType: undefined},
                        ]
                    }
                ]
            },
            order, {new: true}, (error, updated) => {
                if(error) {
                    reject({message: error.message, status: 500});
                } else {
                    resolve({message: 'Update successful', status: 200, data: updated});
                }
            });
    });
    return promise;
};

const findaOrder = (orderId, callback) => {
    Order.findOne({id: orderId}, (error, document) => callback(error, document));
};

const bulkUpload = () => {
    const promise = new Promise((resolve, reject) => {
        const outputConfig = { dbURL: DB_URL, collection: orders_COLLECTION };
        const source = fileStream.createReadStream(path.join(__dirname, '..', '..', '..', 'mock_orders.json'));
        const responeStream = fileStream.createReadStream(path.join(__dirname, '..', '..', '..', 'mock_orders.json'));
        source.on('error', error => {
            reject({message: error.message, status: 500, error: error});
        });
        const destination = streamToMongoDB(outputConfig);
        destination.on('error', error => {
            reject({message: error.message, status: 500, error: error});
        });
        const stream = source.pipe(JSONStream.parse('*')).pipe(destination);
        stream.on('error', error => {
            reject({message: error.message, status: 500, error: error});
        });
        stream.on('finish', () => {
            resolve({message: 'Uploaded', status: 201, data: responeStream});
        });
    });
    return promise;
};

const searchByTitle = (title, userId, callback) => {
    Order.find({title: {$regex: new RegExp('^' + `${title}`, 'i')}, userId: userId}, (error, documents) => callback(error, documents));
};

const filterorders = (category, userId, callback) => {
    Order.find({group: `${category}`, userId: userId}, (error, documents) => callback(error, documents));
};

const getFavoriteorders = (userId, callback) => {
    Order.find({favourite: `yes`, userId: userId}, (error, documents) => callback(error, documents));
};

const getSharedorders = (userId, callback) => {
    Order.find({sharedBy: {$ne : "self-orders"}, userId: userId}, (error, documents) => callback(error, documents));
};

const multiUpdate = (ids, userId, update, callback) => {
    console.log(ids);
    Order.updateMany(
    {
        $and: [
            {id: {$in: ids}},
            {userId: parseInt(userId, 10)},
            {
                accessType: {$in: ['full-access', 'write-only', '', null, 'undefined']}
            }
        ]
    }, update, {new: true}, (error, status) => callback(error, status));
};


const getordersStream = () => Order.find().cursor();

const saveOrder = (data, callback) => {
    Order.create(data, (error, saved) => callback(error, saved));
};

const deleteorders = (ids, userId, callback) => {
    Order.deleteMany(
    {
        $and: [
            {id: {$in: ids}},
            {userId: parseInt(userId, 10)},
            {accessType: {$in: ['full-access', '', null, 'undefined']}}
        ]
    }, error => callback(error))
};

const datify = function(dateString) {
    return new Date(dateString);
};

const getFormattedDate = () => {
    var todayTime = new Date();
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return month + "/" + day + "/" + year;
};

module.exports = {
    getorders,
    createOrder,
    updateOrder,
    bulkUpload,
    getordersStream,
    getFavoriteorders,
    getSharedorders,
    findaOrder,
    saveOrder,
    filterorders,
    searchByTitle,
    multiUpdate,
    deleteorders,
    shareOrder
}