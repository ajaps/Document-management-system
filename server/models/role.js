module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    roleId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    roleName: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  });
  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
    });
    Role.hasMany(models.Document, {
      foreignKey: 'roleId',
    });
  };
  return Role;
};
