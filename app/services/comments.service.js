const {
  selectCommentsByArticleId,
  deleteCommentByCommentId,
  insertCommentByArticleId,
  updateCommentVotesById,
} = require("../models/comments.model");

const { articleExistsById } = require("../models/articles.model");
const { createHttpError } = require("../utils/errors");

exports.getCommentsByArticleId = (articleId) => {
  return articleExistsById(articleId).then((exists) => {
    if (!exists) return Promise.reject(createHttpError(404));
    return selectCommentsByArticleId(articleId);
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
