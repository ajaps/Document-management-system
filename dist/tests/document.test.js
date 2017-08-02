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
  describe('creates new instance of document', function () {
    it('should return a status code 412, when document has no title', function (done) {
      request.post('/api/v1/documents').set({ Authorization: regularToken }).set('Accept', 'application/json').send({ content: 'In the beginning, God created heaven and earth' }).end(function (err, res) {
        expect(res.body.message.title).to.eql(_mockData2.default.invalidTitle);
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });

    it('should return a status code 412,\n      when document title is less than 10 characters', function (done) {
      request.post('/api/v1/documents').set({ Authorization: regularToken }).set('Accept', 'application/json').send({ content: 'In the beginning,', title: 'history' }).end(function (err, res) {
        expect(res.body.message.title).to.eql(_mockData2.default.shortTitle);
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });

    it('should return a status code 412,\n      when document content is empty', function (done) {
      request.post('/api/v1/documents').set({ Authorization: adminToken }).set('Accept', 'application/json').send({ title: 'history 101' }).end(function (err, res) {
        expect(res.body.message.content).to.eql(_mockData2.default.emptyContent);
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });

    it('should return a status code 201,\n      when document is created', function (done) {
      request.post('/api/v1/documents').set('Accept', 'application/json').set({ Authorization: regularToken }).send(_mockData2.default.newDoc).end(function (err, res) {
        expect(res.body).to.eql(_mockData2.default.createdDoc);
        expect(res.statusCode).to.be.equal(201);
        done();
      });
    });
  });

  describe('get instances of document', function () {
    it('should return a status code 200,\n      and a JSON object showing number of available documents and\n      corresponding document information', function (done) {
      request.get('/api/v1/documents').set('Accept', 'application/json').set({ Authorization: regularToken }).end(function (err, res) {
        expect(res.body.totalCount).to.equal(5);
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });
  describe('get instances of document', function () {
    it('should return a status code 200,\n      and a JSON stating if the document updated', function (done) {
      request.put('/api/v1/documents/3').set('Accept', 'application/json').send({ content: 'In the beginning, God created heaven and earth' }).set({ Authorization: adminToken }).end(function (err, res) {
        expect(res.body.message).to.be.equal('updated successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });
  describe('deletes a document', function () {
    it('should return a status code 200 and a JSON showing the document\n      was deleted if an admin deletes a document', function (done) {
      request.delete('/api/v1/documents/2').set('Accept', 'application/json').set({ Authorization: adminToken }).end(function (err, res) {
        expect(res.body.message).to.be.equal('deleted successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it('should return a status code 401 and a message, if a user tries to\n      delete a document he didnt create', function (done) {
      request.delete('/api/v1/documents/1').set('Accept', 'application/json').set({ Authorization: regularToken }).end(function (err, res) {
        expect(res.body.message).to.be.equal('You do not have access to view/delete the available documents');
        expect(res.statusCode).to.be.equal(401);
        done();
      });
    });
  });
  describe('finds documents by userID', function () {
    it('should return a status code 200 and a JSON showing the document\n      was deleted if an admin deletes a document', function (done) {
      request.get('/api/v1/documents/users/2').set('Accept', 'application/json').set({ Authorization: adminToken }).end(function (err, res) {
        expect(res.body.message).to.be.equal('retrieved successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });
  describe('finds documents by roleID', function () {
    it('should return a status code 200 and a JSON showing the document\n    retrieved if the user has the same roleId or the user is Admin', function (done) {
      request.get('/api/v1/documents/roles/2').set('Accept', 'application/json').set({ Authorization: adminToken }).end(function (err, res) {
        expect(res.body.message).to.be.equal('retrieved successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it('should return a status code 401 and a message, informing the user he\n      does not have access to view documents under this role', function (done) {
      request.get('/api/v1/documents/roles/1').set('Accept', 'application/json').set({ Authorization: regularToken }).end(function (err, res) {
        expect(res.body.message).to.be.equal('You need permission to view documents under this role');
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    });
  });
});