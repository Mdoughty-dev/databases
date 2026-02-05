const db = require("../../db/connection");

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBys = [
    "created_at",
    "votes",
    "author",
    "title",
    "article_id",
    "topic",
    "article_img_url",
  ];

  const lowerOrder = (order || "desc").toLowerCase();

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!["asc", "desc"].includes(lowerOrder)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const queryValues = [];
  let sql = `
    SELECT author, title, article_id, topic, created_at, votes, article_img_url
    FROM articles
  `;

  if (topic) {
    queryValues.push(topic);
    sql += ` WHERE topic = $1`;
  }

  sql += ` ORDER BY ${sort_by} ${lowerOrder}, article_id ${lowerOrder};`;

  return db.query(sql, queryValues).then(({ rows }) => rows);
};
exports.selectArticleById = (articleId) => {
  return db
    .query(
      `
      SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.body,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::int AS comment_count
      FROM articles
      LEFT JOIN comments
        ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `,
      [articleId],
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

exports.updateArticleVotesById = (articleId, inc_votes) => {
  return db
    .query(
      ` UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
      [inc_votes, articleId],
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};
