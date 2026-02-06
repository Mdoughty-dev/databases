const {
  selectArticles,
  selectArticleById,
  updateArticleVotesById,
  insertArticle,
  userExists,
  topicExists,
} = require("../models/articles.model");

const { createHttpError } = require("../utils/errors");

const validSortBys = new Set([
  "created_at",
  "votes",
  "author",
  "title",
  "article_id",
  "topic",
  "article_img_url",
]);

exports.getArticles = (sort_by = "created_at", order = "desc", topic) => {
  const lowerOrder = (order || "desc").toLowerCase();

  if (!validSortBys.has(sort_by)) return Promise.reject(createHttpError(400));
  if (!["asc", "desc"].includes(lowerOrder))
    return Promise.reject(createHttpError(400));

  return selectArticles(sort_by, lowerOrder, topic);
};

exports.getArticleById = (articleId) => {
  return selectArticleById(articleId).then((article) => {
    if (!article) return Promise.reject(createHttpError(404));
    return article;
  });
};

exports.patchArticleVotesById = (articleId, inc_votes) => {
  return updateArticleVotesById(articleId, inc_votes).then((article) => {
    if (!article) return Promise.reject(createHttpError(404));
    return article;
  });
};

exports.addArticle = (newArticle = {}) => {
  const { author, title, body, topic, article_img_url } = newArticle;

  if (!author || !title || !body || !topic) {
    return Promise.reject(createHttpError(400));
  }

  if (
    typeof author !== "string" ||
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof topic !== "string" ||
    (article_img_url !== undefined && typeof article_img_url !== "string")
  ) {
    return Promise.reject(createHttpError(400));
  }

  return Promise.all([userExists(author), topicExists(topic)]).then(
    ([authorOk, topicOk]) => {
      if (!authorOk) return Promise.reject(createHttpError(404));
      if (!topicOk) return Promise.reject(createHttpError(404));

      return insertArticle({ author, title, body, topic, article_img_url });
    },
  );
};
