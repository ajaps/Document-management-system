import chai from 'chai';
import supertest from 'supertest';
import authentication from '../../server/middleware/authentication';
import mockData from './mockData/mockData';
import server from '../../server';


const expect = chai.expect;
const request = supertest(server);
const adminToken = authentication.setUserToken(mockData.admin);
const regularToken = authentication.setUserToken(mockData.regularUser);

describe('When user', () => {
  describe('creates new instance of document', () => {
    it('should return status code 412, when document has no title', (done) => {
      request.post('/api/v1/documents')
    .set({ Authorization: regularToken })
    .set('Accept', 'application/json')
    .send({ content: 'In the beginning, God created heaven and earth' })
    .end((err, res) => {
      expect(res.body.detailed_error.title).to.eql(mockData.invalidTitle);
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });

    it(`should return a status code 412,
      when document title is less than 3 characters`, (done) => {
      request.post('/api/v1/documents')
    .set({ Authorization: regularToken })
    .set('Accept', 'application/json')
    .send({ content: 'In the beginning,', title: 'to' })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });

    it(`should return a status code 412,
      when document content is empty`, (done) => {
      request.post('/api/v1/documents')
    .set({ Authorization: adminToken })
    .set('Accept', 'application/json')
    .send({ title: 'history 101' })
    .end((err, res) => {
      expect(res.body.detailed_error.content).to.eql(mockData.emptyContent);
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });

    it(`should return a status code 201,
      when document is created`, (done) => {
      request.post('/api/v1/documents')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .send(mockData.newDoc)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(201);
        done();
      });
    });

    it(`should return a status code 412, when document access
      is anything other than public, private, role or null`, (done) => {
      request.post('/api/v1/documents')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .send(mockData.invalidAccessType)
      .end((err, res) => {
        expect(res.body.error).to.equal('An unexpected error occurred');
        expect(res.statusCode).to.be.equal(409);
        done();
      });
    });
  });

  describe('get instances of document', () => {
    it(`should return a status code 200,
      and a JSON object showing number of available documents and
      corresponding document information`, (done) => {
      request.get('/api/v1/documents')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body.pagination.totalCount).to.equal(5);
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it(`should return a status code 200,
      and a an end of file message, when the offset is more than
        the number of documents in the return object`, (done) => {
      request.get('/api/v1/documents?offset=101')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body.message).to
          .equal('End of page - There are no documents on this page');
        expect(res.body.pagination.totalCount).to.equal(5);
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });

  describe('finds document by ID', () => {
    it(`should return a status code 200,
      and a JSON stating if the document retrieved`, (done) => {
      request.get('/api/v1/documents/3')
      .set('Accept', 'application/json')
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('retrieved successfully');
        expect(res.body.document[0].id).to.be.equal(3);
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });

  describe('updates a document', () => {
    it(`should return a status code 200,
      and a JSON stating if the document updated`, (done) => {
      request.put('/api/v1/documents/3')
      .set('Accept', 'application/json')
      .send({ content: 'In the beginning, God created heaven and earth' })
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('Documents updated successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it(`should return a status code 404,
      and a JSON stating if the document to updated doesn't exist`, (done) => {
      request.put('/api/v1/documents/30')
      .set('Accept', 'application/json')
      .send({ content: 'In the beginning, God created heaven and earth' })
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.body.error).to.be.equal(mockData.docNotFound);
        expect(res.statusCode).to.be.equal(404);
        done();
      });
    });

    it(`should return a status code 412 and a corresponding JSON object,
      if the document title is less than 3 characters`, (done) => {
      request.put('/api/v1/documents/3')
      .set('Accept', 'application/json')
      .send({ title: 'Fo' })
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.body.detailed_error.title)
          .to.be.eql(mockData.invalidTitleLength);
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });

    it(`should return a status code 400 and a corresponding JSON object,
      if the document access specified is invalid(e.g. protected)`, (done) => {
      request.put('/api/v1/documents/3')
      .set('Accept', 'application/json')
      .send({ access: 'protected' })
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.body).to.be.eql(mockData.invalidAccess);
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    });

    it(`should return a status code 412 and a corresponding JSON object,
      if the document ID specified is invalid(i.e not a number)`, (done) => {
      request.put('/api/v1/documents/frank')
      .set('Accept', 'application/json')
      .send({ access: 'public' })
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.body.detailed_error.id).to.be.eql(mockData.invalidId);
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });
  });
  describe('deletes a document', () => {
    it(`should return a status code 200 and a JSON showing the document
      was deleted if an admin deletes a document`, (done) => {
      request.delete('/api/v1/documents/2')
      .set('Accept', 'application/json')
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('deleted successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it(`should return a status code 401 and a message, if a user tries to
      delete a document he didnt create`, (done) => {
      request.delete('/api/v1/documents/1')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body.error).to.be
        .equal('the Document ID does not exist');
        expect(res.statusCode).to.be.equal(404);
        done();
      });
    });
  });
  describe('finds documents by userID', () => {
    it(`should return a status code 200 and a JSON showing the document
      retrieved successfully`, (done) => {
      request.get('/api/v1/users/1/documents')
      .set('Accept', 'application/json')
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('retrieved successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });
  describe('finds documents by roleID', () => {
    it(`should return a status code 200 and a JSON showing the document
    retrieved if the user has the same roleId or the user is Admin`, (done) => {
      request.get('/api/v1/roles/2/documents')
      .set('Accept', 'application/json')
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.body.message).to.be
          .equal('documents retrieved successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it(`should return a status code 200 and a and a JSON object containng
      documents under user own's role, when the ID specified
        does not match the user's roleId`, (done) => {
      request.get('/api/v1/roles/4/documents')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body.pagination.totalCount).to.be.equal(2);
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });
});
