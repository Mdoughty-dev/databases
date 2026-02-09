const db = require("../../db/connection");

exports.selectComments = () => {
  return db.query("SELECT * FROM comments;").then(({ rows }) => rows);
};

exports.selectCommentsByArticleId = (article_id, limit, p) => {
  const offset = (p - 1) * limit;

  const commentsQuery = db.query(
    `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
    `,
    [article_id, limit, offset]
  );

  const countQuery = db.query(
    `
    SELECT COUNT(*)::int AS total_count
    FROM comments
    WHERE article_id = $1;
    `,
    [article_id]
  );

  return Promise.all([commentsQuery, countQuery]).then(([commentsRes, countRes]) => {
    return {
      comments: commentsRes.rows,
      total_count: countRes.rows[0].total_count,
    };
  });
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
