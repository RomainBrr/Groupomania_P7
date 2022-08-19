// Import de cloudinary pour stocker les images et les gérer
const cloudinary = require("cloudinary").v2;
// Models
const User = require("../models/User");
const Post = require("../models/Post");

// Récupération de tous les posts
exports.getAllPosts = async (req, res) => {
  try {
    // Tri des posts dans l'odre antéchronologique avec "DESC"
    const allPosts = await Post.findAll({ order: [["createdAt", "DESC"]] });

    res.status(200).json(allPosts);
  } catch (error) {
    console.log("ERROR", error);
    res.status(400).json(error);
  }
};

// Création d'un post
exports.createPost = async (req, res) => {
  let newPost;

  try {
    if (!req.files.image) {
      const {
        title,
        content,
        likes = 0,
        is_image = false,
        user_id,
        username,
      } = req.fields;

      newPost = await Post.create({
        title,
        content,
        likes,
        is_image: false,
        owner_id: user_id,
        owner_name: username,
        usersIds_likes: JSON.stringify([]),
      });
      return res.status(200).json({ message: "Nouveau post créé", newPost });
    } else {
      const {
        title,
        content,
        likes = 0,
        is_image = true,
        user_id,
        username,
      } = req.fields;
      const { image } = req.files;

      // Utilisation de cloudinary pour uploader les images, et création du dossier où les images sont stockées
      let pictureToUpload = image.path;
      const uploadImage = await cloudinary.uploader.upload(pictureToUpload, {
        folder: `/groupomania_app/user_${user_id}`,
      });

      newPost = await Post.create({
        title,
        content,
        likes,
        is_image: true,
        image_url: uploadImage.secure_url,
        owner_id: user_id,
        owner_name: username,
        usersIds_likes: JSON.stringify([]),
      });
    }

    return res.status(200).json({ message: "Nouveau post créé", newPost });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ error });
  }
};

// Suppression d'un post
exports.deletePost = async (req, res) => {
  const { post_id, user_id } = req.fields;
  try {
    // Recherche de l'utilisateur avec son userId
    const USER = await User.findOne({ where: { user_id } });
    //  Recherche du post à supprimer
    const postToDelete = await Post.findOne({
      where: { post_id: post_id },
    });
    if (postToDelete) {
      // Si l'utilisateur est admin ou que l'id du posteur correspond à l'id de l'utilisateur connecté
      if (USER.is_admin || postToDelete.owner_id === USER.user_id) {
        //  On récupère l'Id de l'image pour la supprimer dans la base de données
        const databaseId = postToDelete.image_url.split("/");
        const id = databaseId[databaseId.length - 1].split(".");
        console.log("ID", id[0]);

        const dtbPostDeletionFeedback = await postToDelete.destroy();
        // Suppression de l'image dans cloudinary
        if (postToDelete.is_image && postToDelete.image_url !== "") {
          const dtbMediaDeletionFeedback =
            await cloudinary.api.delete_resources_by_prefix(
              `groupomania_app/user_${user_id}/${id[0]}`
            );

          return res.status(200).json({
            message: "le post à été supprimé",
            dtbPostDeletionFeedback,
            dtbMediaDeletionFeedback,
          });
        } else
          return res.status(200).json({
            message: "le post à été supprimé",
            dtbPostDeletionFeedback,
          });
      } else
        return res.status(400).json({
          message: " Erreur. Suppression non autorisée",
        });
    } else return res.status(400).json({ message: "Erreur: post introuvable" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

// Modification d'un post
exports.modifyPost = async (req, res) => {
  try {
    const { post_id, user_id } = req.fields;
    console.log("reqfields", req.fields);
    // Recherche de l'utilisateur avec son id
    const USER = await User.findOne({ where: { user_id } });
    //  Recher du post à modifier avec son id
    const postToModify = await Post.findOne({ where: { post_id } });

    //  Si l'utilisateur est admin ou le posteur du post à modifier correspond à l'id de l'utilisateur connecté
    if (USER.is_admin || postToModify.owner_id === USER.user_id) {
      postToModify.set(req.fields);
      console.log("postToModify", postToModify);

      //  Récupération de l'id de l'image et suppression de l'image dans cloudinary sans ajout d'une nouvelle image

      const databaseId = postToModify.image_url.split("/");
      const id = databaseId[databaseId.length - 1].split(".");

      await cloudinary.api.delete_resources_by_prefix(
        `groupomania_app/user_${user_id}/${id[0]}`
      );
      // Une fois l'image supprimée, le champ image_url est vide et is_image est false
      postToModify.image_url = "";
      postToModify.is_image = false;
      //  Récupération de l'id de l'image et suppression de l'image dans cloudinary avec ajout d'une nouvelle image
      if (req.files.image) {
        const { image } = req.files;
        let pictureToUpload = image.path;

        // Ici "l'id" de l'image est récupéré
        const databaseId = postToModify.image_url.split("/");
        const id = databaseId[databaseId.length - 1].split(".");

        await cloudinary.api.delete_resources_by_prefix(
          `groupomania_app/user_${user_id}/${id[0]}`
        );
        //  Puis ajout d'une nouvelle image
        const uploadImage = await cloudinary.uploader.upload(pictureToUpload, {
          folder: `/groupomania_app/user_${user_id}`,
        });

        postToModify.image_url = uploadImage.secure_url;
        postToModify.is_image = true;
      }

      const finalModifiedPost = await postToModify.save();

      res.status(200).json({ finalModifiedPost });
    } else
      return res
        .status(400)
        .json({ message: "Erreur. modification non autorisée" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error });
  }
};

// LIKES
exports.likePost = async (req, res) => {
  try {
    // Récupération de l'id du post et du tableau contenant l'id des utilisateurs ayant liké le post
    const { post_id, usersIds_likes } = req.fields;

    console.log("reqfields", req.fields);
    //  Recherche du post par son id
    const postToManageLike = await Post.findOne({ where: { post_id } });

    // Ajout du userId dans la table userIds_likes et ajout du nombre de userId présent dans la table userIds_likes dans la table like
    postToManageLike.set({
      likes: JSON.parse(usersIds_likes).length,
      usersIds_likes,
    });
    const finalModifiedPost = await postToManageLike.save();

    res.status(200).json({ finalModifiedPost });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error });
  }
};
