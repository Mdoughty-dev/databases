const db = require("../../db/connection");

exports.selectComments = () => {
  return db.query("SELECT * FROM comments;").then(({ rows }) => rows);
};

exports.selectCommentsByArticleId = (article_id) => {
  const commentsQuery = db.query(
    `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
    [article_id],
  );

  const articleQuery = db.query(
    `SELECT 1 FROM articles WHERE article_id = $1;`,
    [article_id],
  );

  return Promise.all([commentsQuery, articleQuery]).then(
    ([commentsResult, articleResult]) => {
      if (articleResult.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return commentsResult.rows; // ← can be []
    },
  );
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
    .query(`SELECT article_id FROM articles WHERE article_id = $1;`, [
      articleId,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }

      return db.query(
        "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
        [username, body, articleId],
      );
    })
    .then(({ rows }) => rows[0]);
};
