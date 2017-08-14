import chai from 'chai';
import supertest from 'supertest';
import authentication from '../server/middleware/authentication';
import mockData from './mockData/mockData';
import server from '../server';


const expect = chai.expect;
const request = supertest(server);
const adminToken = authentication.setUserToken(mockData.admin);
const regularToken = authentication.setUserToken(mockData.regularUser);

describe('When user', () => {
  describe('get instances of role', () => {
    it(`should return a status code 200 and a JSON object
      containing all users in the database`, (done) => {
      request.get('/api/v1/roles')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body).to.be.eql(mockData.availableRoles);
        expect(res.body.message).to.be.equal('successful');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });

  describe('with Admin rights creates a new role', () => {
    it(`should return a status code 200 and a JSON object containing the
      newly created role`, (done) => {
      request.post('/api/v1/roles')
      .set('Accept', 'application/json')
      .set({ Authorization: adminToken })
      .send({ roleName: 'management' })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('new role created successfully');
        expect(res.body.role.roleName).to.be.equal('management');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it(`should return a status code 406 and a message when
      the roleName supplied is not a string`, (done) => {
      request.post('/api/v1/roles')
      .set('Accept', 'application/json')
      .set({ Authorization: adminToken })
      .send({ roleName: 1 })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('roleName must be a string');
        expect(res.statusCode).to.be.equal(406);
        done();
      });
    });
  });

  describe('with Admin rights creates a new role that already exists', () => {
    it(`should return a status code 409 and a JSON object
      containing the error information`, (done) => {
      request.post('/api/v1/roles')
      .set('Accept', 'application/json')
      .set({ Authorization: adminToken })
      .send({ roleName: 'management' })
      .end((err, res) => {
        expect(res.body.error).to.be.equal('Validation error');
        expect(res.statusCode).to.be.equal(409);
        done();
      });
    });
  });

  describe('with Admin rights updates a new role', () => {
    it(`should return a status code 403 and a message when
      the role to be update is Admin`, (done) => {
      request.put('/api/v1/roles/1')
      .set('Accept', 'application/json')
      .set({ Authorization: adminToken })
      .send({ roleName: 'student' })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('This action is forbidden');
        expect(res.statusCode).to.be.equal(403);
        done();
      });
    });

    it(`should return a status code 200 and a message when
      the role to be update is not Admin`, (done) => {
      request.put('/api/v1/roles/4')
      .set('Accept', 'application/json')
      .set({ Authorization: adminToken })
      .send({ roleName: 'student' })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('updated successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it(`should return a status code 409 and a message when
      the roleName already exist in the database`, (done) => {
      request.put('/api/v1/roles/4')
      .set('Accept', 'application/json')
      .set({ Authorization: adminToken })
      .send({ roleName: 'management' })
      .end((err, res) => {
        expect(res.body.message)
        .to.be.equal('An unexpected error occurred');
        expect(res.statusCode).to.be.equal(409);
        done();
      });
    });
  });
});
