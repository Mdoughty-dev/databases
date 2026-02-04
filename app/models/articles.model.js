const db = require("../../db/connection");

exports.selectArticles = (sort_by = "created_at", order = "desc") => {
	const validSortBys = [
		"created_at",
		"votes",
		"author",
		"title",
		"article_id",
		"topic",
		"article_img_url"
	];
  const lowerOrder = order.toLowerCase();
  if (!validSortBys.includes(sort_by))
	{
		return Promise.reject({status : 400, msg: "Bad request"});
	}
	if (!["asc", "desc"].includes(lowerOrder))
	{
		return Promise.reject({ status: 400, msg: "Bad request" });
	}
	const sql = `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY ${sort_by} ${lowerOrder};`;
  return db.query(sql).then(({ rows }) => rows);
};

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
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
