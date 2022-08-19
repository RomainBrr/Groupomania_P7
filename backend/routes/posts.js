const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/posts");

// Middleware
const isAuthorized = require("../middlewares/isAuthorized");

// Route pour tous les posts
router.get("/", isAuthorized, postsControllers.getAllPosts);

// Route pour la création d'un post
router.post("/create", isAuthorized, postsControllers.createPost);

// Route pour la suppression d'un post
router.delete("/delete", isAuthorized, postsControllers.deletePost);

// Route pour la modification d'un post
router.put("/modify", isAuthorized, postsControllers.modifyPost);

// Routes likes
router.post("/like", isAuthorized, postsControllers.likePost);

module.exports = router;
