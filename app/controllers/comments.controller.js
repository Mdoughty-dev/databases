const {
  getCommentsByArticleId,
  addCommentToArticle,
  removeCommentById,
  patchCommentVotesById
} = require("../services/comments.service");

const { createHttpError } = require("../utils/errors");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) return next(createHttpError(400));

  getCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (isNaN(article_id)) return next(createHttpError(400));
  if (!username || typeof body !== "string") {
    return next(createHttpError(400));
  }

  addCommentToArticle(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
exports.patchCommentById = (req, res, next) => 
{
	const {comment_id} = req.params;
	const {inc_votes} = req.body;
	if (isNaN(comment_id)) return next(createHttpError(400));
  if (!Number.isInteger(inc_votes)) return next(createHttpError(400));

  patchCommentVotesById(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};


exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  if (isNaN(comment_id)) return next(createHttpError(400));

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

