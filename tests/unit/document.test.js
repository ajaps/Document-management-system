import chai from 'chai';
import models from '../../server/models';
import mockData from '../mockData/mockData';

const expect = chai.expect;

const Document = models.Document;

describe('Documents Model', () => {
  afterEach((done) => {
    models.Document.sync({ force: true })
    .then(() => {
      done();
    });
  });

  let document;

  describe('Create Document', () => {
    it('should create new document', (done) => {
      Document.create(mockData.publicDocument)
        .then((newDocument) => {
          expect(newDocument).to.be.ok;
          expect(newDocument.userId).to.equal(2);
          expect(newDocument.roleId).to.equal(2);
          document = newDocument;
          done();
        });
    });
  });
});
