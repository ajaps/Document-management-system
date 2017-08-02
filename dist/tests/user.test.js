'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _authentication = require('../middleware/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _mockData = require('../mockData/mockData');

var _mockData2 = _interopRequireDefault(_mockData);

var _server = require('../../dist/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;
var request = (0, _supertest2.default)(_server2.default);
var regularToken = void 0;
var adminToken = _authentication2.default.setUserToken(_mockData2.default.admin);

describe('When user', function () {
  describe('signs up', function () {
    it('should return a JSON object containing message and a token', function (done) {
      request.post('/api/v1/users').send({ email: 'johnDoe@yahoo.com', password: 'humanity' }).end(function (err, res) {
        regularToken = res.body.token;
        expect(res.body.message).to.be.equal('New user created successfully');
        expect(regularToken).to.have.lengthOf.above(20);
        expect(res.statusCode).to.be.equal(201);
        done();
      });
    });

    it('should return "johnDoe@yahoo.com already exist" and status 409,\n      when user tries to signup with an existing email', function (done) {
      request.post('/api/v1/users').send({ email: 'johnDoe@yahoo.com', password: 'goodFood' }).end(function (err, res) {
        expect(res.body.message).to.be.equal('johnDoe@yahoo.com already exist');
        expect(res.body.token).to.be.a('null');
        expect(res.statusCode).to.be.equal(409);
        done();
      });
    });

    it('should return a json object with param and msg,\n      when user tries to signup without a valid email', function (done) {
      request.post('/api/v1/users').send({ email: 'johnDoe@yahoo', password: 'goodFood' }).end(function (err, res) {
        expect(res.body.message.email).to.eql(_mockData2.default.invalidEmail);
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });

    it('should return a json object with param and msg,\n      when user tries to signup\n      without a password greater than 8 characters', function (done) {
      request.post('/api/v1/users').send({ email: 'johnDoe@yahoo.com', password: 'Food' }).end(function (err, res) {
        expect(res.body.message.password).to.eql(_mockData2.default.invalidPassword);
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });
  });

  describe('logs In', function () {
    it('should return a JSON object containing message and a token', function (done) {
      request.post('/api/v1/users/login').send({ email: 'johnDoe@yahoo.com', password: 'humanity' }).end(function (err, res) {
        expect(res.body.message).to.be.equal('Logged in successful');
        expect(res.body.token).to.have.lengthOf.above(20);
        expect(res.statusCode).to.be.equal(202);
        done();
      });
    });

    it('should return "Invalid username or password" and status 404,\n      when user tries to log in with a wrong password', function (done) {
      request.post('/api/v1/users/login').send({ email: 'johnDoe@yahoo.com', password: 'loveGoodFood' }).end(function (err, res) {
        expect(res.body.message).to.be.equal('Invalid username or password');
        expect(res.body.token).to.be.a('null');
        expect(res.statusCode).to.be.equal(401);
        done();
      });
    });

    it('should return a json object with token set to null,\n      when user tries to login email not in the database', function (done) {
      request.post('/api/v1/users/login').send({ email: 'frank@gmail.com', password: 'humanity' }).end(function (err, res) {
        expect(res.body.message).to.be.equal('frank@gmail.com does not exist in the database');
        expect(res.statusCode).to.be.equal(404);
        done();
      });
    });
  });

  describe('finds matching instances of user', function () {
    it('should return a all users', function (done) {
      request.get('/api/v1/users').set({ Authorization: regularToken }).set('Accept', 'application/json').end(function (err, res) {
        expect(res.body.Total_Users).to.be.equal(5);
        expect(res.body.users).to.eql(_mockData2.default.usersInDatabase);
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it("should return 'Invalid token' and status 401 if an invalid token is used", function (done) {
      request.get('/api/v1/users').set({ Authorization: _mockData2.default.invalidToken }).set('Accept', 'application/json').end(function (err, res) {
        expect(res.body.message).to.be.equal('Invalid token');
        expect(res.statusCode).to.be.equal(401);
        done();
      });
    });
    it('should return "A token is requeired for authentication" and status 428,\n      when token isn\'t provided', function (done) {
      request.get('/api/v1/users').end(function (err, res) {
        expect(res.body).to.be.equal(_mockData2.default.noToken);
        expect(res.body.token).to.be.a('undefined');
        expect(res.statusCode).to.be.equal(428);
        done();
      });
    });
  });

  describe('search for users by ID', function () {
    it('should return status code 412 if userID is not specified', function (done) {
      request.get('/api/v1/users/fr').set({ Authorization: regularToken }).set('Accept', 'application/json').end(function (err, res) {
        expect(res.body.message.id.msg).to.be.equal('ID must be a number');
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });
    it('should return a JSON object containing the users\'\n      attributes if the ID exist', function (done) {
      request.get('/api/v1/users/1').set('Accept', 'application/json').set({ Authorization: regularToken }).end(function (err, res) {
        expect(res.body.user).to.be.an('array');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });

  describe('update user attributes', function () {
    it('should return a status code 404,\n      when user(not Admin) tries to update another users attributes', function (done) {
      request.put('/api/v1/users/3').set({ Authorization: regularToken }).set('Accept', 'application/json').send({ email: 'frank@gmail.com', password: 'humanity' }).end(function (err, res) {
        expect(res.body.message).to.be.equal("Only an Admin can update another user's attributes");
        expect(res.statusCode).to.be.equal(401);
        done();
      });
    });
  });

  describe('delete user attributes', function () {
    it('should return a status code 401, when the user who does not have Admin\n      rights tries to delete a record other that his ', function (done) {
      request.delete('/api/v1/users/1').set({ Authorization: regularToken }).set('Accept', 'application/json').end(function (err, res) {
        expect(res.body.message).to.be.equal("Only an Admin can delete another user's record");
        expect(res.statusCode).to.be.equal(401);
        done();
      });
    });
    it('should return a status code 200, when the user deletes own record or \n      user has admin rights to delete any record', function (done) {
      request.delete('/api/v1/users/5').set({ Authorization: regularToken }).set('Accept', 'application/json').end(function (err, res) {
        expect(res.body.message).to.be.equal('User deleted successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it('should return a status code 404, \n      when the user deletes a record that does not exist', function (done) {
      request.delete('/api/v1/users/10').set({ Authorization: adminToken }).set('Accept', 'application/json').end(function (err, res) {
        expect(res.body.message).to.be.equal('User ID does not exist');
        expect(res.statusCode).to.be.equal(404);
        done();
      });
    });
  });
});