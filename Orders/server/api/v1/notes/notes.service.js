const ordersdao = require('./orders.dao');
const uploadorders = () => ordersdao.bulkUpload();
const getorders = userId => ordersdao.getorders(userId);
const createOrder = (order, userId) => ordersdao.createOrder(order, userId);
const shareOrder = (order, userId) => ordersdao.shareOrder(order, userId);
const streamorders = () => ordersdao.getordersStream();
const updateOrder = (order, orderId) => ordersdao.updateOrder(order, orderId);

const getFavoriteorders = (userId) => {
    const promise = new Promise((resolve, reject) => {
        ordersdao.getFavoriteorders(userId, (error, documents) => {
            if(error) {
                reject({message: error.message, status: 500});
            } else {
                resolve({message: 'Found', status: 200, data: documents});
            }
        });
    });
    return promise;
};

const getSharedorders = (userId) => {
    const promise = new Promise((resolve, reject) => {
        ordersdao.getSharedorders(userId, (error, documents) => {
            if(error) {
                reject({message: error.message, status: 500});
            } else {
                resolve({message: 'Found', status: 200, data: documents});
            }
        });
    });
    return promise;
};

const searchByTitle = (title, userId) => {
    const promise = new Promise((resolve, reject) => {
        ordersdao.searchByTitle(userId, title, (error, documents) => {
            if(error) {
                reject({message: error.message, status: 500});
            } else {
                resolve({message: 'Found', status: 200, data: documents});
            }
        });
    });
    return promise;
};

const filterorders = (category, userId) => {
    const promise = new Promise((resolve, reject) => {
        ordersdao.filterorders(userId, category, (error, documents) => {
            if(error) {
                reject({message: error.message, status: 500});
            } else {
                resolve({message: 'Found', status: 200, data: documents});
            }
        });
    });
    return promise;
};

const multiUpdate = (orderIds, userId, commonUpdateData) => {
    const promise = new Promise((resolve, reject) => {
        const idArray = orderIds.split(',');
        ordersdao.multiUpdate(idArray, userId, commonUpdateData, (error, status) => {
            if(error) {
                reject({message: error.message, status: 500});
            } else {
                resolve({message: 'Updated', status: 200, data: status});
            }
        });
    });
    return promise;
};

const deleteorders = (idArray, userId) => {
    const promise = new Promise((resolve, reject) => {
        ordersdao.deleteorders(idArray, userId, error => {
            if(error) {
                reject({message: error.message, status: 500});
            } else {
                resolve({message: 'Deleted', status: 200, data: []});
            }
        });
    });
    return promise;
};

module.exports = {
    createOrder,
    getorders,
    getFavoriteorders,
    getSharedorders,
    searchByTitle,
    shareOrder,
    uploadorders,
    streamorders,
    filterorders,
    updateOrder,
    multiUpdate,
    deleteorders
}
