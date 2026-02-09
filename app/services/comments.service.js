const {
  selectCommentsByArticleId,
  deleteCommentByCommentId,
  insertCommentByArticleId,
  updateCommentVotesById,
} = require("../models/comments.model");

const { articleExistsById } = require("../models/articles.model");
const { createHttpError } = require("../utils/errors");

exports.getCommentsByArticleId = (articleId, limit = 10, p = 1) => {
  const parsedLimit = Number(limit);
  const parsedP = Number(p);
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1)
    return Promise.reject(createHttpError(400));
  if (!Number.isInteger(parsedP) || parsedP < 1)
    return Promise.reject(createHttpError(400));	
  return articleExistsById(articleId).then((exists) => {
    if (!exists) return Promise.reject(createHttpError(404));
    return selectCommentsByArticleId(articleId, parsedLimit, parsedP);
  });
};

exports.removeCommentById = (commentId) => {
  return deleteCommentByCommentId(commentId).then((deleted) => {
    if (!deleted) return Promise.reject(createHttpError(404));
    return;
  });
};

exports.addCommentToArticle = (articleId, username, body) => {
  return articleExistsById(articleId).then((exists) => {
    if (!exists) return Promise.reject(createHttpError(404));
    return insertCommentByArticleId(articleId, username, body);
  });
};

exports.patchCommentVotesById = (commentId, inc_votes) => {
  return updateCommentVotesById(commentId, inc_votes).then((comment) => {
    if (!comment) return Promise.reject(createHttpError(404));
    return comment;
  });
};
