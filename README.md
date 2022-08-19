# Groupomania_App

## **Installation du projet**

Décompresser le dossier du projet ou cloner le fichier Github

## **Démarrer le BACKEND**

A la racine du projet :

Ouvrir le terminal puis tapez :

- cd backend
- npm install

Puis creer un fichier .env dans lequel vous entrerez vos variables d'environnement nécéssaires pour la connexion sous cette forme :

Dans le fichier .env, définissez vos variables comme suit:
NOM_DE_LA_VARIABLE=valeurdelavariable

**Base de Données mySQL** : DATABASE_USER,
DATABASE_PASSWORD

**Clé secrète pour le token** : SECRET_KEY,
Notez que vous pouvez choisir la clé secrète que vous souhaitez

**Cloudinary pour stocker les images** : CLOUDINARY_CLOUD_NAME = dteuwr4mt
CLOUDINARY_API_KEY = 477748462764231
CLOUDINARY_API_SECRET = vOCo9HHAc21OPyy-4ItK2GpSz5M

Notez que pour Cloudinary vous devez copier/coller le nom et la valeur.

Afin de créer la base de données, accédez au dossier models (cd backend/models ou cd /models si vous êtes déjà dans le dossier backend) puis lancez un node User.js et un node Post.js pour créer les tables

(Pensez à redémarrer votre éditeur de code)

Enfin dans le terminal, tapez "node server.js ou npm start" pour lancer le serveur:

## **Démarrer le FRONTEND**

Ouvrir le terminal puis tapez :

- cd frontend
- npm install

Enfin dans le terminal, tapez "npm start" pour lancer l'application.
