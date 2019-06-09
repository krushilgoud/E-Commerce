const request = require('supertest');
const app = require('../app');
const config = require('./test.config');
const expect = require('chai').expect;
const UserModel = require('../api/v1/users/users.entity').userModel;
const modules = require('../modules');
const register_user = config.register_user;

const USERS_URI = '/api/v1/users';

before(done => {
    modules.initializeMongooseConnection()
        .then(() => done());
});

beforeEach(done => {
    UserModel.create(register_user);
    done();
});

afterEach(done => {
    UserModel.remove({username: 'test@test.com'});
    done();
})

describe('Testing to login user', function() {
    it('Should handle a request to successfully login', function(done)
    {
        request(app)
            .post(`${USERS_URI}/login`)
            .send(register_user)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done(error);
                } else {
                    expect(response.body.user.userName).to.be.equal('test@test.com');
                }
            });
        done();
    });

    it('Should handle a request to login with wrong password', function(done)
    {
        request(app)
            .post(`${USERS_URI}/login`)
            .send({
                username: 'test@test.com',
                password: 'not-a-password'
            })
            .expect(403)
            .end((error, response) => {
                if(error) {
                    done(error)
                } else {
                    expect(response.body.message).to.be.equal('Passwords is incorrect');
                }
            });
        done();
    });

    it('Should handle a request to login with wrong username', function(done)
    {
        request(app)
            .post(`${USERS_URI}/login`)
            .send({
                username: 'not-a-test@test.com',
                password: 'password12'
            })
            .expect(403)
            .end((error, response) => {
                if(error) {
                    done(error)
                } else {
                    expect(response.body.message).to.be.equal('You are not registered user');
                }
        });
        done();
    });
});