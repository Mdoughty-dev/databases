const {
  selectComments,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentByCommentId,
} = require("../models/comments.model");

exports.getComments = (req, res, next) => {
  selectComments()
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request" });
  }
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  if (isNaN(comment_id)) {
    return res.status(400).send({ msg: "Bad request" });
  }
  deleteCommentByCommentId(comment_id)
    .then(() => {
      return res.status(204).send();
    })
    .catch(next);
};
exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (isNaN(article_id) || !username || !body) {
    return res.status(400).send({ msg: "Bad request" });
  }
  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};
