const router = require("express").Router();

const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controller");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controller");

router.get("/", getArticles);

router.get("/:article_id", getArticleById);
router.patch("/:article_id", patchArticleById);

router
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = router;

