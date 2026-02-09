const {
  getArticles,
  getArticleById,
  patchArticleVotesById,
  addArticle,
  removeArticleById
} = require("../services/articles.service");

const { createHttpError } = require("../utils/errors");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;

  getArticles(sort_by, order, topic, limit, p)
    .then(({ articles, total_count }) =>
      res.status(200).send({ articles, total_count }),
    )
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

exports.deleteArticleById = (req, res, next) => 
{
	const { article_id } = req.params;
	if (!isNaN) return next(createHttpError(400));
	removeArticleById(article_id)
	.then(() =>
		{
			res.status(204).send();
		})
	.catch(next);
}
