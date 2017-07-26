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
    Role.hasMany(models.Document, {
      foreignKey: 'roleId',
    });
  };
  return Role;
};
