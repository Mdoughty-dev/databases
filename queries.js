const db = require("./db/connection");

const runQueries = async () => {
  try {
    const users = await db.query(`
      		SELECT username FROM users;
    		`);
    console.log("ALL USERS:", users.rows);
    const coding = await db.query(`
		SELECT * FROM articles
		WHERE topic = 'coding'
		`);
    console.log("Articles about coding", coding.rows);
    const negativeVotes = await db.query(`
			SELECT * FROM comments
			WHERE votes < 0;
			`);
    console.log("Negative votes", negativeVotes.rows);
    const topics = await db.query(`
			SELECT slug FROM topics;
			`);
    console.log("Topics list", topics.rows);
    const grumpy19 = await db.query(`
			SELECT * FROM articles
			WHERE author = 'grumpy19';
			`);
    console.log("Articles by grumpy19", grumpy19.rows);
    const positiveVotes = await db.query(`
                        SELECT * FROM comments
                        WHERE votes > 10;
                        `);
    console.log("comments greater than 10 votes", positiveVotes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    db.end();
  }
};
runQueries();
