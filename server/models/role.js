module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    roleName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    }
  });
  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
    });
  };

  // Hooks
  Role.beforeValidate((role) => {
    role.roleName = (role.roleName).toLowerCase();
  });

  return Role;
};
