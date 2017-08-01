'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _mockData = require('../mockData/mockData');

var _mockData2 = _interopRequireDefault(_mockData);

var _server = require('../../dist/server');

var _server2 = _interopRequireDefault(_server);

var _authentication = require('../middleware/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;
var request = (0, _supertest2.default)(_server2.default);
var adminToken = _authentication2.default.setUserToken(_mockData2.default.admin);
var regularToken = _authentication2.default.setUserToken(_mockData2.default.regularUser);

describe('When user', function () {
  describe('get instances of role', function () {
    it('should return a status code 200 and a JSON object \n      containing all users in the database', function (done) {
      request.get('/api/v1/roles').set('Accept', 'application/json').set({ Authorization: regularToken }).end(function (err, res) {
        expect(res.body.role).to.be.an('array');
        expect(res.body.roleCount).to.be.equal(4);
        expect(res.body.message).to.be.equal('roles retrieved successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });

  describe('with Admin rights creates a new role', function () {
    it('should return a status code 200 and a JSON object containing the\n      newly created role', function (done) {
      request.post('/api/v1/roles').set('Accept', 'application/json').set({ Authorization: adminToken }).send({ roleName: 'management' }).end(function (err, res) {
        expect(res.body.message).to.be.equal('new role created successfully');
        expect(res.body.role.roleName).to.be.equal('management');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it('should return a status code 406 and a message when\n      the roleName supplied is not a string', function (done) {
      request.post('/api/v1/roles').set('Accept', 'application/json').set({ Authorization: adminToken }).send({ roleName: 1 }).end(function (err, res) {
        expect(res.body.message).to.be.equal('roleName must be a string');
        expect(res.statusCode).to.be.equal(406);
        done();
      });
    });
  });

  describe('with Admin rights updates a new role', function () {
    it('should return a status code 400 and a message when \n      the role to be update is Admin', function (done) {
      request.put('/api/v1/roles/1').set('Accept', 'application/json').set({ Authorization: adminToken }).send({ roleName: 'student' }).end(function (err, res) {
        expect(res.body.message).to.be.equal('Admin role cannot be update');
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    });

    it('should return a status code 200 and a message when \n      the role to be update is not Admin', function (done) {
      request.put('/api/v1/roles/4').set('Accept', 'application/json').set({ Authorization: adminToken }).send({ roleName: 'student' }).end(function (err, res) {
        expect(res.body.message).to.be.equal('updated successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it('should return a status code 409 and a message when \n      the roleName already exist in the database', function (done) {
      request.put('/api/v1/roles/4').set('Accept', 'application/json').set({ Authorization: adminToken }).send({ roleName: 'management' }).end(function (err, res) {
        expect(res.body.message).to.be.equal('An error occured updating roleName');
        expect(res.statusCode).to.be.equal(409);
        done();
      });
    });
  });
});