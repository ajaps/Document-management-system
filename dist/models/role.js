'use strict';

module.exports = function (sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    roleName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    }
  });
  Role.associate = function (models) {
    Role.hasMany(models.User, {
      foreignKey: 'roleId'
    });
  };
  return Role;
};