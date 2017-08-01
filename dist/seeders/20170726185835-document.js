'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('Documents', [{
      title: 'Introduction to 101',
      content: 'Who b this goat?',
      access: 'public',
      userId: 1,
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Introduction to 102',
      content: 'Who b this fush?',
      access: 'private',
      userId: 2,
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Introduction to 103',
      content: 'Who b this goat?',
      access: 'role',
      userId: 3,
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Introduction to 104',
      content: 'Who b this tortoise?',
      access: 'role',
      userId: 4,
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Introduction to 105',
      content: 'Did i do that? did i really do that?',
      access: 'role',
      userId: 2,
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  down: function down(queryInterface) {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Documents', null, {});
    return queryInterface.bulkDelete('Roles', null, {});
  }
};