const db = require("../../db/connection");

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const queryValues = [];
  let sql = `
    SELECT author, title, article_id, topic, created_at, votes, article_img_url
    FROM articles
  `;

  if (topic) {
    queryValues.push(topic);
    sql += ` WHERE topic = $1`;
  }

  sql += ` ORDER BY ${sort_by} ${order}, article_id ${order};`;

  return db.query(sql, queryValues).then(({ rows }) => rows);
};
exports.articleExistsById = (articleId) => {
  return db
    .query(`SELECT 1 FROM articles WHERE article_id = $1;`, [articleId])
    .then(({ rowCount }) => rowCount > 0);
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
    .then(({ rows }) => rows[0] || null);
};

exports.updateArticleVotesById = (articleId, inc_votes) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
      `,
      [inc_votes, articleId],
    )
    .then(({ rows }) => rows[0] || null);
};

exports.userExists = (username) => {
  return db
    .query(`SELECT 1 FROM users WHERE username = $1;`, [username])
    .then(({ rowCount }) => rowCount > 0);
};

exports.topicExists = (slug) => {
  return db
    .query(`SELECT 1 FROM topics WHERE slug = $1;`, [slug])
    .then(({ rowCount }) => rowCount > 0);
};

exports.insertArticle = ({ author, title, body, topic, article_img_url }) => {
  if (article_img_url === undefined) {
    return db
      .query(
        `
        WITH inserted AS (
          INSERT INTO articles (author, title, body, topic)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        )
        SELECT inserted.*, 0::int AS comment_count
        FROM inserted;
        `,
        [author, title, body, topic],
      )
      .then(({ rows }) => rows[0]);
  }

  return db
    .query(
      `
      WITH inserted AS (
        INSERT INTO articles (author, title, body, topic, article_img_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      )
      SELECT inserted.*, 0::int AS comment_count
      FROM inserted;
      `,
      [author, title, body, topic, article_img_url],
    )
    .then(({ rows }) => rows[0]);
};
