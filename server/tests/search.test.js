import chai from 'chai';
import supertest from 'supertest';
import mockData from '../mockData/mockData';
import server from '../../server';
import authentication from '../middleware/authentication';

const expect = chai.expect;
const request = supertest(server);
const regularToken = authentication.setUserToken(mockData.regularUser);

describe('When user', () => {
  describe('searches for user', () => {
    it(`should return a status code 200 and a JSON object
      containing available users that matches the search term`, (done) => {
      request.get('/api/v1/search/users/?q=fr')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body.users).to.be.an('array');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });

  describe('searches for documents', () => {
    it(`should return a status code 200 and a JSON object containing available
      docs where the title matches the search term`, (done) => {
      request.get('/api/v1/search/documents/?q=introduction')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body.Documents).to.be.an('array');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });
});
