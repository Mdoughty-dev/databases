const {
  selectArticles,
  selectArticleById,
  updateArticleVotesById,
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request" });
  }
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (isNaN(article_id)) return res.status(400).send({ msg: "Bad request" });
  if (!Number.isInteger(inc_votes))
    return res.status(400).send({ msg: "Bad request" });
  updateArticleVotesById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
