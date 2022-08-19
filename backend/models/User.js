const { DataTypes, Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);
const User = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      default: "",
      unique: true,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  { tableName: "users" }
);

sequelize
  .sync()
  .then(() => {
    console.log("La table users a bien été créée !");
  })
  .catch((error) => {
    console.error("Impossible de créer la table : ", error);
  });

if (User !== sequelize.models.users) {
  (async () => {
    await User.sync({ force: true });
  })()
    .then(() => {
      console.log("La table users a bien été mise à jour ! ");
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

module.exports = User;
