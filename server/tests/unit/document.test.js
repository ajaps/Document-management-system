import chai from 'chai';
import models from '../../../server/models';
import mockData from '../mockData/mockData';

const expect = chai.expect;

const Document = models.Document;

describe('Documents Model', () => {
  let document;
  const docTitle = { title: 'Fun facts' };
  const query = { where: { id: 1 } };

  describe('Create Document function', () => {
    it('should create new document in the database', (done) => {
      Document.create(mockData.publicDocument)
        .then((newDocument) => {
          expect(newDocument).to.be.ok;
          expect(newDocument.userId).to.equal(2);
          expect(newDocument.roleId).to.equal(2);
          document = newDocument;
          done();
        });
    });

    it('should return an error when title is empty', (done) => {
      Document.create(mockData.noTitle)
        .then()
        .catch((error) => {
          expect(error.errors[0].message).to.equal('title cannot be null');
          expect(error.errors[0].type).to.equal('notNull Violation');
          expect(error.errors[0].path).to.equal('title');
          done();
        });
    });
  });

  describe('update Document function', () => {
    it('should update existing document', (done) => {
      Document.update(docTitle, query)
        .then((updateDocument) => {
          expect(updateDocument).to.be.ok;
          expect(updateDocument[0]).to.equal(1);
          done();
        });
    });
    it(`should return an error when access type is not 'public',
        'private' or 'role'`, (done) => {
      Document.create(mockData.invalidAccessType)
        .then()
        .catch((error) => {
          expect(error.errors[0].type).to.equal('Validation error');
          expect(error.errors[0].path).to.equal('access');
          done();
        });
    });
  });

  describe('delete Document function', () => {
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
