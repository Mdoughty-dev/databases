const router = require("express").Router();

const {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticle,
  deleteArticleById	
} = require("../controllers/articles.controller");

const {
  getCommentsByArticleId,
  postCommentByArticleId,	
} = require("../controllers/comments.controller");

router.route("/").get(getArticles).post(postArticle);

router.get("/:article_id", getArticleById);
router.patch("/:article_id", patchArticleById);
router.delete("/:article_id", deleteArticleById);

router
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = router;
