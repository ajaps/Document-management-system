module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Documents', [
      {
        title: 'Introduction to 101',
        content: 'The definition of computer is',
        access: 'public',
        userId: 1,
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Introduction to 102',
        content: 'The study of the earth has been ongoing for centuries',
        access: 'private',
        userId: 2,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Introduction to 103',
        content: 'In actual terms, the study of man and his environment',
        access: 'role',
        userId: 3,
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Introduction to 104',
        content: 'javascript keeps evolving to meet human wants and needs',
        access: 'role',
        userId: 4,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Introduction to 105',
        content: 'Did i do that? did i really do that?',
        access: 'role',
        userId: 2,
        roleId: 2,
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
