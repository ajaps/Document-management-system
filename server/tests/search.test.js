import chai from 'chai';
import supertest from 'supertest';
import authentication from '../../server/middleware/authentication';
import mockData from './mockData/mockData';
import server from '../../server';

const expect = chai.expect;
const request = supertest(server);
const regularToken = authentication.setUserToken(mockData.regularUser);

describe('When user', () => {
  describe('searches for user', () => {
    it(`should return a status code 200 and
      list of users that matches the search term 'fr'`, (done) => {
      request.get('/api/v1/search/users/?q=fr')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body).to.be.eql(mockData.userSearchResult);
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it(`should return a status code 404 and a messge
      when the serach term does not match any user`, (done) => {
      request.get('/api/v1/search/users/?q=zrr')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body.message).to.be
          .equal('No username matching the search term');
        expect(res.statusCode).to.be.equal(404);
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
        expect(res.body).to.be.eql(mockData.docSearchResult);
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it(`should return a status code 404 and a messge
      when the serach term does not match any document`, (done) => {
      request.get('/api/v1/search/documents/?q=English language')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body.message).to.be
          .equal('No Document title matching the search term');
        expect(res.statusCode).to.be.equal(404);
        done();
      });
    });
  });
});
