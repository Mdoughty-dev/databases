const db = require("../../db/connection");

exports.selectComments = () => {
  return db.query("SELECT * FROM comments;").then(({ rows }) => rows);
};

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [articleId],
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }

      return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
        [articleId],
      );
    })
    .then(({ rows }) => rows);
};
exports.deleteCommentByCommentId = (commentId) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      commentId,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
};
exports.insertCommentByArticleId = (articleId, username, body) => {
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [username, body, articleId],
    )
    .then(({ rows }) => rows[0]);
};
