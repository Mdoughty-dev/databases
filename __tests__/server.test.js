const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: responds with { msg: 'ok' }", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "ok" });
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users.length).toBeGreaterThan(0);

        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            }),
          );
        });
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics.length).toBeGreaterThan(0);

        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            }),
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles.length).toBeGreaterThan(0);

        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            }),
          );
        });
      });
  });
  test("GET /api/articles supports sort_by and order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            }),
          );
        });

        const votes = articles.map((a) => a.votes);
        const sortedVotes = [...votes].sort((a, b) => a - b);
        expect(votes).toEqual(sortedVotes);
      });
  });
	test("GET /api/articles supports sort_by and order AND will sort in DESC Order", () => {
  return request(app)
    .get("/api/articles?sort_by=topic&order=desc")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;

      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);

      articles.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });

      const topics = articles.map((a) => a.topic);

      const sortedTopics = [...topics].sort((a, b) => b.localeCompare(a));

      expect(topics).toEqual(sortedTopics);
    });
});

});
test("GET /api/articles accepts topic query and filters results", () => {
  return request(app)
    .get("/api/articles?topic=coding")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toBeInstanceOf(Array);
      body.articles.forEach((article) => {
        expect(article.topic).toBe("coding");
      });
    });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with a single article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          }),
        );
      });
  });

  test("400: invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: valid article_id but does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);

        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            }),
          );
        });
      });
  });
describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200: responds with an article object that includes comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number), 
          })
        );
      });
  });

  test("200: comment_count matches the number of comments for that article", () => {
    const articleId = 1;

    const countComments = db
      .query(`SELECT COUNT(*)::int AS count FROM comments WHERE article_id = $1;`, [
        articleId,
      ])
      .then(({ rows }) => rows[0].count);

    const getArticle = request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => body.article.comment_count);

    return Promise.all([countComments, getArticle]).then(([expectedCount, apiCount]) => {
      expect(apiCount).toBe(expectedCount);
    });
  });

  test("404: responds with 'Article not found' when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: responds with 'Bad request' when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});


  test("400: invalid article_id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: valid article_id but does not exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: inserts a comment and responds with the new comment", () => {
    const newComment = { username: "butter_bridge", body: "nice article!" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: "butter_bridge",
            body: "nice article!",
            article_id: 1,
            votes: expect.any(Number),
            created_at: expect.any(String),
          }),
        );
      });
  });

  test("400: invalid article_id", () => {
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send({ username: "butter_bridge", body: "hello" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: missing required fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: valid article_id but does not exist", () => {
    return request(app)
      .post("/api/articles/999999/comments")
      .send({ username: "butter_bridge", body: "hello" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: increments votes and responds with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: expect.any(Number),
          }),
        );
      });
  });

  test("200: decrements votes and responds with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article.votes).toEqual(expect.any(Number));
      });
  });

  test("400: invalid article_id", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: invalid inc_votes type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "1" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: missing inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: valid article_id but does not exist", () => {
    return request(app)
      .patch("/api/articles/999999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
