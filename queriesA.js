const db = require('./db/connection');

const runQueries = async () => {
  try {
    const users = await db.query(`
      SELECT * FROM users;
    `);
    console.log('ALL USERS:', users.rows);

    const codingArticles = await db.query(`
      SELECT * FROM articles
      WHERE topic = 'coding';
    `);
    console.log('ARTICLES ABOUT CODING:', codingArticles.rows);

    const negativeComments = await db.query(`
      SELECT * FROM comments
      WHERE votes < 0;
    `);
    console.log('COMMENTS WITH NEGATIVE VOTES:', negativeComments.rows);

    const topics = await db.query(`
      SELECT * FROM topics;
    `);
    console.log('ALL TOPICS:', topics.rows);

    const grumpyArticles = await db.query(`
      SELECT * FROM articles
      WHERE author = 'grumpy19';
    `);
    console.log('ARTICLES BY grumpy19:', grumpyArticles.rows);

    const popularComments = await db.query(`
      SELECT * FROM comments
      WHERE votes > 10;
    `);
    console.log('COMMENTS WITH MORE THAN 10 VOTES:', popularComments.rows);

  } catch (err) {
    console.error(err);
  } finally {
    db.end();
  }
};

runQueries();

