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
var regularToken = _authentication2.default.setUserToken(_mockData2.default.regularUser);

describe('When user', function () {
  describe('searches for user', function () {
    it('should return a status code 200 and a JSON object \n      containing available users that matches the search term', function (done) {
      request.get('/api/v1/search/users/?q=fr').set('Accept', 'application/json').set({ Authorization: regularToken }).end(function (err, res) {
        expect(res.body.users).to.be.an('array');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });

  describe('searches for documents', function () {
    it('should return a status code 200 and a JSON object containing available \n      docs where the title matches the search term', function (done) {
      request.get('/api/v1/search/documents/?q=introduction').set('Accept', 'application/json').set({ Authorization: regularToken }).end(function (err, res) {
        expect(res.body.Documents).to.be.an('array');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });
});