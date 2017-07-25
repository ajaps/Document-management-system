module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      allowNull: false,
      len: [10, 150],
      type: DataTypes.STRING,
      unique: true,
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    access: {
      defaultValue: 'public',
      isIn: {
        args: [['public', 'private', 'role']],
        msg: 'Must be public, private or role',
      },
      type: DataTypes.STRING,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    roleId: {
      defaultValue: 2,
      isNumeric: true,
      type: DataTypes.INTEGER,
    }
  });
  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Document.belongsTo(models.Role, {
      foreignKey: 'roleId',
    });
  };
  return Document;
};
