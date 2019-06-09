const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const service = require('../api/v1/jwt.auth.service');
const JWT_BASE_URL = `/api/v1/auth`;
let token;

before(done => {
    service.signToken({username: 'user.test@cognizant.com', userId: '1'}, (error, jwt) => {
        console.log(error);
        token = jwt;
    });
    done();
});

describe('Test to sign in and verify JWT', function() {
     it('Should handle request to sign in successfully', function(done) {
        request(app)
        .post(`${JWT_BASE_URL}/signin`)
        .send({username: 'test.user@cognizant.com', userId: '1'})
        .expect(200)
        .end((error, response) => {
            if(error) {
                done(error);
            } else {
                expect(response.body.token).to.be.not.equal(null | undefined);
            }
        });
         done();
     });
      it('Should handle request to verify a user', function(done) {
        request(app)
        .post(`${JWT_BASE_URL}/verify`)
        .send({token: token})
        .expect(200)
        .end((error, response) => {
            if(error) {
                done(error);
            } else {
                expect(response.body.payload).to.be.not.equal(null | undefined);
                expect(response.body.payload.username).to.be.equal('user.test@cognizant.com')
            }
        });
        done();
      });
});