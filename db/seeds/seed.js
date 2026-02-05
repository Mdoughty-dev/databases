const db = require("../connection");

const seedUsers = (userData) => {
  const userPromises = userData.map((user) => {
    return db.query(
      `
      INSERT INTO users (username, name, avatar_url)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [user.username, user.name, user.avatar_url],
    );
  });
  return Promise.all(userPromises); // Insert all users
};

const seedTopics = (topicData) => {
  const topicPromises = topicData.map((topic) => {
    return db.query(
      `
			INSERT INTO topics (description, slug, img_url)
			VALUES ($1, $2, $3)
			RETURNING *;
			`,
      [topic.description, topic.slug, topic.img_url],
    );
  });
  return Promise.all(topicPromises);
};

const seedArticles = (articleData) => {
  const articlePromises = articleData.map((article) => {
    return db
      .query(
        `
      INSERT INTO articles (title, topic, author, votes, body, created_at, article_img_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `,
        [
          article.title,
          article.topic,
          article.author,
          article.votes,
          article.body,
          article.created_at,
          article.article_img_url,
        ],
      )
      .catch((err) => {
        console.error("Error inserting article:", err);
      });
  });
  return Promise.all(articlePromises);
};
const seedComments = (commentData) => {
  const commentPromises = commentData.map((comment) => {
    return db
      .query(
        `
      SELECT article_id
      FROM articles
      WHERE title = $1
      LIMIT 1;
    `,
        [comment.article_title],
      )
      .then((result) => {
        if (result.rows.length > 0) {
          const article_id = result.rows[0].article_id;
          return db
            .query(
              `
          INSERT INTO comments (article_id, body, votes, author, created_at)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `,
              [
                article_id,
                comment.body,
                comment.votes,
                comment.author,
                comment.created_at,
              ],
            )
            .catch((err) => {
              console.error("Error inserting comment:", err);
            });
        } else {
          console.error(
            `No article found with title: ${comment.article_title}`,
          );
        }
      })
      .catch((err) => {
        console.error(
          "Error fetching article_id for title:",
          comment.article_title,
          err,
        );
      });
  });

  return Promise.all(commentPromises);
};

const seed = (devData) => {
  //console.log(devData);
  const { userData, topicData, articleData, commentData } = devData;
  //  console.log(articleData);
  return db
    .query(
      `DROP TABLE IF EXISTS comments;
    	    DROP TABLE IF EXISTS articles;
            DROP TABLE IF EXISTS users;
	    DROP TABLE IF EXISTs topics;`,
    )
    .then(() => {
      return db.query(`
        CREATE TABLE topics (
          slug VARCHAR PRIMARY KEY,
          description VARCHAR NOT NULL,
          img_url VARCHAR(1000)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR PRIMARY KEY,
          name VARCHAR NOT NULL,
          avatar_url VARCHAR(1000)
        );
      `);
    })
    .then(() => {
      return db.query(`
	      CREATE TABLE articles(
	      article_id SERIAL PRIMARY KEY, 
	      title VARCHAR(100),
	      topic VARCHAR REFERENCES topics(slug), 
	      author VARCHAR REFERENCES users(username), 
	      body TEXT, 
	      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	      votes INT DEFAULT 0, 
	      article_img_url VARCHAR(1000)
	      );
	      `);
    })
    .then(() => {
      return db.query(`
	      CREATE TABLE comments(
	      comment_id SERIAL PRIMARY KEY,
              article_id INT REFERENCES articles(article_id) NOT NULL,
              body TEXT,
              votes INT DEFAULT 0,
              author VARCHAR REFERENCES users(username),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	      );
	      `);
    })
    .then(() => seedUsers(userData))
    .then(() => seedTopics(topicData))
    .then(() => seedArticles(articleData))
    .then(() => seedComments(commentData))
    .then(() => {
      console.log("seeding complete");
    })
    .catch((err) => {
      console.error("error durring seeding", err);
    });
};

module.exports = seed;
