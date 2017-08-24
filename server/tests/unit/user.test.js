import chai from 'chai';
import models from '../../../server/models';
import mockData from '../mockData/mockData';

const expect = chai.expect;

const User = models.User;

describe('Users Model', () => {
  let user;
  const query = { where: { id: 3 } };

  describe('Create User', () => {
    it('should create new user', (done) => {
      User.create(mockData.UserData)
        .then((newUser) => {
          expect(newUser).to.be.ok;
          expect(newUser.roleId).to.be.equal(2);
          user = newUser;
          done();
        });
    });

    it('created new user should have username, email', (done) => {
      expect(user.username).to.have.lengthOf.above(0);
      expect(user.email).to.have.string('@');
      done();
    });
  });

  describe('delete user', () => {
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
