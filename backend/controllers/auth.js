// Import d'argon2 pour hacher le mot de passe
const argon2 = require("argon2");
// Import de jsonwebtoken pour créer le token
const jwt = require("jsonwebtoken");
// Models
const User = require("../models/User");

// Route Signup
exports.signup = async (req, res) => {
  // Destructuration
  const { email, password, is_admin } = req.fields;

  try {
    // Hachage du mot de passe
    const hash = await argon2
      .hash(password, {
        type: argon2.argon2id,
        hashLength: 16,
      })
      .then((hash) => {
        return hash;
      });
    // Création du nouvel utilisateur avec dans son email, mot de passe haché et son "statut"
    const newUser = await User.create({ email, password: hash, is_admin });

    const operationOK = {
      response: "Nouvel utilisateur créé !",
      newUser,
    };

    console.log(operationOK);
    res.status(200).json(operationOK);
  } catch (error) {
    console.log("Error", error);
    return res.status(400).send(error);
  }
};

// Route login
exports.login = async (req, res) => {
  // Destructuration
  const { email, password } = req.fields;
  console.log("Fields", req.fields);

  try {
    // Recherche d'un utilisateur dans la base de données avec son email
    const targetedUser = await User.findOne({ where: { email } });
    // Si l'utilisateur n'est pas trouvé, message d'erreur
    if (targetedUser === null) {
      console.log("Not found!");
      res.status(400).json({
        message: "Aucun utlisateur trouvé",
      });
    } else {
      //  Si l'utilisateur est trouvé, vérification avec de son mot de passe haché avec la méthode vérify d'argon2
      const verifyPassword = await argon2.verify(
        targetedUser.password,
        password
      );

      if (verifyPassword) {
        //  On créé un pseudo en récupérant la partie de l'adresse située avant l'arobase
        const username = targetedUser.email.split("@")[0];
        //  Si tout est ok, création du token avec la méthode sign de jwt
        return res.status(200).json({
          userId: targetedUser.user_id,
          is_admin: targetedUser.is_admin ? true : false,
          username,
          token: jwt.sign(
            { userId: targetedUser.user_id },
            process.env.SECRET_KEY
          ),
        });
      } else {
        console.log("Accès refusé");
        res.status(401).json({ message: "Mauvais email ou mot de passe" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
