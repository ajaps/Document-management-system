import chai from 'chai';
import models from '../../../server/models';
import mockData from '../mockData/mockData';

const expect = chai.expect;

const Document = models.Document;

describe('Documents Model', () => {
  let document;
  const docTitle = { title: 'Fun facts' };
  const query = { where: { id: 1 } };

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

  describe('update Document', () => {
    it('should update existing document', (done) => {
      Document.update(docTitle, query)
        .then((updateDocument) => {
          expect(updateDocument).to.be.ok;
          expect(updateDocument[0]).to.equal(1);
          done();
        });
    });
  });

  describe('delete Document', () => {
    it('should delete existing document', (done) => {
      Document.destroy(query)
        .then((deleteDocument) => {
          expect(deleteDocument).to.be.ok;
          expect(deleteDocument).to.equal(1);
          done();
        });
    });
  });
});
