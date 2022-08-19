const { DataTypes, Sequelize } = require("sequelize");
const User = require("./User");
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

const Post = sequelize.define(
  "posts",
  {
    post_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    usersIds_likes: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]",
    },
    is_image: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: true,
    },

    owner_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "posts" }
);

// On précise ici que la clé primaire est user_id et que la clé étrangère est owner_id
Post.belongsTo(User, {
  foreignKey: "owner_id",
  targetKey: "user_id",
});

sequelize
  .sync()
  .then(() => {
    console.log("La table posts a bien été créée!");
  })
  .catch((error) => {
    console.error("Impossible de créer la table : ", error);
  });

if (Post !== sequelize.models.posts) {
  (async () => {
    await Post.sync({ force: true });
  })()
    .then(() => {
      console.log("La table posts a bien été mise à jour ! ");
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

module.exports = Post;
