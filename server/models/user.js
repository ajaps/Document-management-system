import bcrypt from 'bcrypt';
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      isEmail: true,
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      allowNull: false,
      len: [8],
      type: DataTypes.STRING,
    },
    roleId: {
      allowNull: false,
      defaultValue: 2,
      isNumeric: true,
      type: DataTypes.INTEGER,
    },
  });
  //relationship declaration
  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Document, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'documents',
    });
  };

  //Hooks
  User.afterValidate((user) =>
    user.password = bcrypt.hashSync(user.password, SALT_ROUNDS)
  );
  User.beforeValidate((user) =>
    user.email = (user.email).toLowerCase()
  );
  return User;
};
