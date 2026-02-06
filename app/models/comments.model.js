const db = require("../../db/connection");

exports.selectComments = () => {
  return db.query("SELECT * FROM comments;").then(({ rows }) => rows);
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
      [article_id],
    )
    .then(({ rows }) => rows);
};

exports.deleteCommentByCommentId = (commentId) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      commentId,
    ])
    .then(({ rows }) => rows[0] || null);
};

exports.insertCommentByArticleId = (articleId, username, body) => {
  return db
    .query(
      `
      INSERT INTO comments (author, body, article_id)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [username, body, articleId],
    )
    .then(({ rows }) => rows[0]);
};
exports.updateCommentVotesById = (commentId, inc_votes) => {
  return db
    .query(
      `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *;
      `,
      [inc_votes, commentId],
    )
    .then(({ rows }) => rows[0] || null);
};
