module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Roles', [
      {
        roleName: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'regular',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'facilitator',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'fellow',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down(queryInterface) {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Documents', null, {});
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
