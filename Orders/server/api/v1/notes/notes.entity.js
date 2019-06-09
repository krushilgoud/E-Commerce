const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    title: {
        type: String
    },
    text: {
        type: String
    },
    state: {
        type: String,
        default: 'not-started'
    },
    group: {
        type: String,
        default: 'default'
    },
    favourite: {
        type: String,
        default: 'no'
    },
    userId: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date
    },
    modifiedOn: {
        type: Date
    },
    sharedBy: {
        type: String,
        default: 'self-orders'
    },
    accessType: {
        type: String,
        default: 'full-access'
    },
    reminder: {
        type: Date,
        required: false
    }
});

autoIncrement.initialize(mongoose.connection);

ordersSchema.plugin(autoIncrement.plugin, {
    model: 'ordersSchema', 
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

const ordersModel = mongoose.model('ordersSchema', ordersSchema, 'orders');

module.exports = {
    ordersModel
}