import chai from 'chai';
import models from '../../../server/models';
import mockData from '../mockData/mockData';

const expect = chai.expect;

const User = models.User;

describe('Users Model', () => {
  let user;
  const query = { where: { id: 3 } };

  describe('Create User function', () => {
    it('should create new user', (done) => {
      User.create(mockData.UserData)
        .then((newUser) => {
          expect(newUser).to.be.ok;
          expect(newUser.roleId).to.be.equal(2);
          expect(user.username).to.have.lengthOf.above(0);
          expect(user.email).to.have.string('@');
          done();
        });
    });

    it('should return an error when username is not provided', (done) => {
      User.create()
        .catch((error) => {
          expect(error.errors[0].message)
            .to.be.equal('username cannot be null');
          expect(error.errors[0].type).to.equal('notNull Violation');
          expect(error.errors[0].path).to.equal('username');
          done();
        });
    });
  });

  describe('delete user function', () => {
    it('should delete existing user', (done) => {
      User.destroy(query)
        .then((deleteUser) => {
          expect(deleteUser).to.be.ok;
          expect(deleteUser).to.equal(1);
          done();
        });
    });
  });
});
