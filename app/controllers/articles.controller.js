const {
  getArticles,
  getArticleById,
  patchArticleVotesById,
  addArticle,
} = require("../services/articles.service");

const { createHttpError } = require("../utils/errors");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  getArticles(sort_by, order, topic)
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) return next(createHttpError(400));

  getArticleById(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(article_id)) return next(createHttpError(400));
  if (!Number.isInteger(inc_votes)) return next(createHttpError(400));

  patchArticleVotesById(article_id, inc_votes)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  addArticle(req.body)
    .then((article) => res.status(201).send({ article }))
    .catch(next);
};
