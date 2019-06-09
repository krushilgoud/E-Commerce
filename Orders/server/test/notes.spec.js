const request = require('supertest'), app = require('../app'), config = require('./test.config'), expect = require('chai').expect, modules = require('../modules');
const jwt = require('../api/jwt'), secret = require('../config').JWT_SECRET, expiry = require('../config').TOKEN_EXPIRE;
const OrderModel = require('../api/v1/orders/orders.entity').ordersModel, user_1_payload = require('./test.config').user_1_payload, user_2_payload = require('./test.config').user_2_payload, user_3_payload = require('./test.config').user_3_payload;
const BASE_PATH = '/api/v1/orders', order1 = config.order1, order2 = config.order2, updateOrder1 = config.updateOrder1, orderId = config.orderId, USER_ID_1 = '1', USER_ID_2 = '2', USER_ID_3 = '3';

let token_1, token_2, token_3;

before(done => {
    jwt.signToken(user_1_payload, secret, expiry, (error, token) => {
        token_1 = token;
    });
    done();
});

before(done => {
    jwt.signToken(user_2_payload, secret, expiry, (error, token) => {
        token_2 = token;
    });
    done();
});

before(done => {
    jwt.signToken(user_3_payload, secret, expiry, (error, token) => {
        token_3 = token;
    });
    done();
});

before(done => {
    modules.initializeMongooseConnection()
        .then(() => done())
});

before(done => {
    OrderModel.remove({})
        .then(() => done());
});

describe('Test to add a order', function () {
  it('Should handle request to add a new order for user 1', function (done) {
    request(app)
        .post(`${BASE_PATH}?userId=${USER_ID_1}`)
        .set('Authorization', `Bearer ${token_1}`)
        .send(order1)
        .expect(201)
        .end((error, response) => {
            expect(error).to.be.equal(null | undefined);
            expect(response.body.text).to.be.equal(order1.text);
        });
    done();
  });

  it('Should handle request to add a new order for user 2', function (done) {
    request(app)
        .post(`${BASE_PATH}?userId=${USER_ID_2}`)
        .set('Authorization', `Bearer ${token_2}`)
        .send(order2)
        .expect(201)
        .end((error, response) => {
            expect(error).to.be.equal(null | undefined);
            expect(response.body.text).to.be.equal(order2.text);
        });
      done();
  });
});

describe('Test to get orders', function () {
  it('Should handle request to get orders of user 1', function (done) {
    request(app)
        .get(`${BASE_PATH}?userId=${USER_ID_1}`)
        .set('Authorization', `Bearer ${token_1}`)
        .expect(200)
        .end((error, response) => {
            expect(error).to.be.equal(null | undefined);
            expect(response.body).to.be.not.equal(undefined | null);
        });
    done();
  });

  it('Should handle request to get orders of user 2', function (done) {
    request(app)
        .get(`${BASE_PATH}?userId=${USER_ID_2}`)
        .set('Authorization', `Bearer ${token_2}`)
        .expect(200)
        .end((error, response) => {
            expect(response.text).to.be.not.equal(undefined | null);
            expect(error).to.be.equal(null | undefined);
        });
    done();
  });

  it('Should handle request to get orders of a user who doesnt have any', function (done) {
    request(app)
        .get(`${BASE_PATH}?userId=${USER_ID_3}`)
        .set('Authorization', `Bearer ${token_3}`)
        .expect(200)
        .end((error, response) => {
            expect(response.body.length).to.be.equal(0);
            expect(error).to.be.equal(null | undefined);
        });
    done();
  });

    it('Should handle request to search a order by title', function(done) {
        request(app)
            .get(`${BASE_PATH}/search/:title`)
            .send('Authorization', `Bearer ${token_1}`)
            .expect(200)
            .end((error, response) => {
                expect(response.body).to.be.not.equal(null | undefined);
                expect(error).to.be.equal(null | undefined);
            });
        done();
    });
});

describe('Test to update a order', function () {
  it('Should handle request to update a order by id', function (done) {
    request(app)
        .put(`${BASE_PATH}/${orderId}`)
        .set('Authorization', `Bearer ${token_1}`)
        .send(updateOrder1)
        .expect(200)
        .end((error, response) => {
            expect(response.body.text).to.be.equal(updateOrder1.text);
            expect(error).to.be.equal(null | undefined);
        });
    done();
  });
});