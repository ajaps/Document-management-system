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
      values: ['public', 'private', 'role'],
      type: DataTypes.STRING,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });

  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Document.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onUpdate: 'CASCADE',
    });
  };
  return Document;
};
