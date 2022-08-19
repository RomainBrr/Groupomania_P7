// Importation de jsonwebtoken
const jwt = require("jsonwebtoken");

// Middleware d'authentification
const isAuthorized = async (req, res, next) => {
  const getAuthorization = req.headers.authorization.split(" ")[1];

  // Condition si le token est présent, avec la méthode verify, on vérifie si le userId correspond au userId du token décodé
  if (getAuthorization) {
    try {
      jwt.verify(getAuthorization, process.env.SECRET_KEY, (e, decoded) => {
        if (e) {
          throw e;
        }
        console.log("Tokendecoded", decoded);
        const parsedToken = decoded.userId;

        if (!parsedToken) {
          console.log("Données d'accès incorrectes");
          throw new Error("Données d'accès incorrectes");
        } else {
          req.fields.user_id = decoded.userId;
          console.log("Autorisation ok");
          next();
        }
      });
    } catch (error) {
      console.log(error);
      res.status(403).json(error);
    }
  } else {
    res.status(401).json({ message: error });
  }
};

module.exports = isAuthorized;
