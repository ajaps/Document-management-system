module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'ajaps@yahoo.com',
        password: '$2a$10$VSliXg/cEpWXgzAobxAjWO5BI4Ne7zWoEaA5u3LezSsiw3TVIg2ca',
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'ajaps1@yahoo.com',
        password: '$2a$10$gGanO99O6BtOO1hisUJuKeOxai.ZFEn4docNbC6xryg1LC47wYn6i',
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'framky007@yahoo.com',
        password: '$2a$10$VSliXg/cEpWXgzAobxAjWO5BI4Ne7zWoEaA5u3LezSsiw3TVIg2ca',
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'framky0071@yahoo.com',
        password: '$2a$10$VSliXg/cEpWXgzAobxAjWO5BI4Ne7zWoEaA5u3LezSsiw3TVIg2ca',
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
