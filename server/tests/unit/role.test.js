import chai from 'chai';
import models from '../../../server/models';
import mockData from '../mockData/mockData';

const expect = chai.expect;

const Role = models.Role;

describe('Roles Model', () => {
  let role;

  describe('Create Role function', () => {
    it('should create new role', (done) => {
      Role.create(mockData.testRole)
        .then((newRole) => {
          expect(newRole).to.be.ok;
          expect(role.roleName).to.be.ok;
          expect(role.roleName).to.equal('visitor');
          done();
        });
    });
  });

  describe('Create Role function', () => {
    it('ensures a role can only be created once(unique)', (done) => {
      Role.create(mockData.testRole)
          .catch((error) => {
            expect(error.errors[0].message)
              .to.be.equal('roleName must be unique');
            expect(error.errors[0].type).to.be.equal('unique violation');
            done();
          });
    });
  });
});
