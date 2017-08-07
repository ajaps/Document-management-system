import bcrypt from 'bcrypt';
// const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const saltRounds = 10;
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      allowNull: false,
      isEmail: true,
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      allowNull: false,
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
    user.password = bcrypt.hashSync(user.password, saltRounds)
  );
  return User;
};
