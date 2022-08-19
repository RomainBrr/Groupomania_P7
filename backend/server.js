require("dotenv").config();

const express = require("express");
const port = process.env.PORT || 4200;
const { Sequelize } = require("sequelize");
const formidableMiddleware = require("express-formidable");

const cloudinary = require("cloudinary").v2;

const app = express();
// Routes
const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");

// Module pour gérer les données de formulaire
app.use(formidableMiddleware());

// Body-parser intégré à Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ajout des en-têtes de réponse avec la méthode res.setHeader HTTP (Cors)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// Configuration de la base de données
const sequelize = new Sequelize(
  "groupomania",
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

// Connexion à la base de données
try {
  sequelize.authenticate();
  console.log("Connecté à la base de données MySQL!");
} catch (error) {
  console.error("Impossible de se connecter, erreur suivante :", error);
}

// Connexion à cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);

// Si une route est inexistante
app.all("*", (req, res) => {
  res.status(404).send("Oups, cette page n'existe pas");
});

app.listen(port, () => {
  console.log(`Le serveur a démarré sur le port ${port || 4200}`);
});
