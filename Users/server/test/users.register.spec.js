const request = require('supertest');
const app = require('../app');
const config = require('./test.config');
const expect = require('chai').expect;
const UserModel = require('../api/v1/users/users.entity').userModel;
const modules = require('../modules');

const duplicate_user = {
    username: 'duplicate@duplicate.com',
    password: 'password'
};

let user = config.user;
const USERS_URI = '/api/v1/users';

before(done => {
    modules.initializeMongooseConnection()
        .then(() => done());
});

before(done => {
    UserModel.remove({})
        .then(() => done());
});

describe('Testing to register a user', function()
{
  it('Should handle a request to register a user', function(done)
  {
    request(app)
    .post(`${USERS_URI}/register`)
    .send(user)
    .expect(201)
    .end((error, response) => {
      if(error) {
        done(error);
      }
      expect(response.body.user.userInfo).to.be.equal('john.doe@domain.com');
      expect(response.body.user.message).to.be.equal('Successfully registered');
    });
    done();
  });

  it('Should handle a request to register a user multiple times with same username', function(done)
  {
    before(done => {
      UserModel.create(duplicate_user);
      done();
  });
    request(app)
    .post(`${USERS_URI}/register`)
    .send(duplicate_user)
    .expect(403)
    .end((error, response) => {
      expect(error).to.be.equal(null | undefined);
      expect(response.body.message).to.be.equal('username is already exist');
    });
    done()
  });
});