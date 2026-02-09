const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

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
describe("PATCH /api/comments/:comment_id", () => {
  test("200: increments votes by positive inc_votes and responds with updated comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("comment");
        const { comment } = body;

        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            votes: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          }),
        );

        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: body2 }) => {
            expect(body2.comment.votes).toBe(comment.votes + 1);
          });
      });
  });

  test("200: decrements votes by negative inc_votes", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id", 2);
        expect(body.comment.votes).toEqual(expect.any(Number));
      });
  });

  test("200: ignores extra properties on the request body", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1, bananas: "nope" })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.comment_id).toBe(1);
        expect(body.comment.votes).toEqual(expect.any(Number));
      });
  });

  test("400: invalid comment_id (not a number)", () => {
    return request(app)
      .patch("/api/comments/not-a-number")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: valid comment_id but comment does not exist", () => {
    return request(app)
      .patch("/api/comments/999999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("400: missing inc_votes in body", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: inc_votes is the wrong type (string)", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "1" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: inc_votes is NaN / invalid number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: Number("nope") })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
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
            }),
          );
        });

        const topics = articles.map((a) => a.topic);

        const sortedTopics = [...topics].sort((a, b) => b.localeCompare(a));

        expect(topics).toEqual(sortedTopics);
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
        expect(body.msg).toBe("Not found");
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
});
describe("GET /api/articles/:article_id/comments (pagination)", () => {
  test("200: responds with comments and total_count", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("comments");
        expect(Array.isArray(body.comments)).toBe(true);

        expect(body).toHaveProperty("total_count");
        expect(typeof body.total_count).toBe("number");
        expect(Number.isInteger(body.total_count)).toBe(true);
        expect(body.total_count).toBeGreaterThanOrEqual(body.comments.length);

        expect(body.comments.length).toBeLessThanOrEqual(5);

        if (body.comments.length > 0) {
          expect(body.comments[0]).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            })
          );
        }

        for (let i = 0; i < body.comments.length - 1; i++) {
          expect(new Date(body.comments[i].created_at) >= new Date(body.comments[i + 1].created_at)).toBe(true);
        }
      });
  });

  test("200: p=2 returns the next page (different results to p=1) when enough comments exist", () => {
    const limit = 2;

    const page1 = request(app).get(`/api/articles/1/comments?limit=${limit}&p=1`);
    const page2 = request(app).get(`/api/articles/1/comments?limit=${limit}&p=2`);

    return Promise.all([page1, page2]).then(([res1, res2]) => {
      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);

      const ids1 = res1.body.comments.map((c) => c.comment_id);
      const ids2 = res2.body.comments.map((c) => c.comment_id);

      if (ids1.length > 0 && ids2.length > 0) {
        ids1.forEach((id) => expect(ids2).not.toContain(id));
      }

      expect(res1.body.total_count).toBe(res2.body.total_count);
    });
  });

  test("400: invalid limit", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=0&p=1")
      .expect(400);
  });

  test("400: invalid p", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=0")
      .expect(400);
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
          }),
        );
      });
  });

  test("200: comment_count matches the number of comments for that article", () => {
    const articleId = 1;

    const countComments = db
      .query(
        `SELECT COUNT(*)::int AS count FROM comments WHERE article_id = $1;`,
        [articleId],
      )
      .then(({ rows }) => rows[0].count);

    const getArticle = request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => body.article.comment_count);

    return Promise.all([countComments, getArticle]).then(
      ([expectedCount, apiCount]) => {
        expect(apiCount).toBe(expectedCount);
      },
    );
  });

  test("404: responds with 'Not found' when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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
        expect(body.msg).toBe("Not found");
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
        expect(body.msg).toBe("Not found");
      });
  });
  test("200: responds with total_count (ignores limit) and defaults to limit=10, p=1", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles.length).toBe(10);

        expect(body.total_count).toBeDefined();
        expect(typeof body.total_count).toBe("number");
        expect(body.total_count).toBeGreaterThanOrEqual(body.articles.length);
      });
  });

  test("200: accepts limit query and returns that many articles", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles.length).toBe(5);
        expect(typeof body.total_count).toBe("number");
      });
  });

  test("200: accepts p query (page) and returns next page (no overlap with page 1)", () => {
    return Promise.all([
      request(app).get("/api/articles?limit=5&p=1").expect(200),
      request(app).get("/api/articles?limit=5&p=2").expect(200),
    ]).then(([res1, res2]) => {
      const page1Ids = res1.body.articles.map((a) => a.article_id);
      const page2Ids = res2.body.articles.map((a) => a.article_id);

      expect(page1Ids.length).toBe(5);
      expect(Array.isArray(page2Ids)).toBe(true);

      page2Ids.forEach((id) => {
        expect(page1Ids).not.toContain(id);
      });
    });
  });

  test("200: total_count respects topic filter (but still ignores limit)", () => {
    return db
      .query(
        `SELECT COUNT(*)::int AS count FROM articles WHERE topic = 'coding';`,
      )
      .then(({ rows }) => {
        const expectedCount = rows[0].count;

        return request(app)
          .get("/api/articles?topic=coding&limit=2&p=1")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeInstanceOf(Array);
            expect(body.articles.length).toBeLessThanOrEqual(2);

            body.articles.forEach((article) => {
              expect(article.topic).toBe("coding");
            });

            expect(body.total_count).toBe(expectedCount);
          });
      });
  });

  test("400: invalid limit (not a number)", () => {
    return request(app)
      .get("/api/articles?limit=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: invalid limit (less than 1)", () => {
    return request(app)
      .get("/api/articles?limit=0")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: invalid p (not a number)", () => {
    return request(app)
      .get("/api/articles?p=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: invalid p (less than 1)", () => {
    return request(app)
      .get("/api/articles?p=0")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
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
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("POST /api/articles", () => {
  test("201: creates an article and responds with the new article including comment_count", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "My brand new article",
      body: "This is the article body",
      topic: "mitch",
      article_img_url: "https://example.com/some-image.png",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            author: "butter_bridge",
            title: "My brand new article",
            body: "This is the article body",
            topic: "mitch",
            article_img_url: "https://example.com/some-image.png",
            votes: expect.any(Number),
            created_at: expect.any(String),
            comment_count: 0,
          }),
        );
      });
  });

  test("201: defaults article_img_url when not provided", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "No image provided",
      body: "Body content here",
      topic: "mitch",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            author: "butter_bridge",
            title: "No image provided",
            body: "Body content here",
            topic: "mitch",
            votes: expect.any(Number),
            created_at: expect.any(String),
            comment_count: 0,
          }),
        );
        expect(typeof body.article.article_img_url).toBe("string");
        expect(body.article.article_img_url.length).toBeGreaterThan(0);
      });
  });

  test("400: missing required field (no body)", () => {
    const badArticle = {
      author: "butter_bridge",
      title: "Missing body",
      topic: "coding",
    };

    return request(app)
      .post("/api/articles")
      .send(badArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: missing required field (no author)", () => {
    const badArticle = {
      title: "Missing author",
      body: "hi",
      topic: "coding",
    };

    return request(app)
      .post("/api/articles")
      .send(badArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: invalid types (body is not a string)", () => {
    const badArticle = {
      author: "butter_bridge",
      title: "Bad types",
      body: 123,
      topic: "coding",
    };

    return request(app)
      .post("/api/articles")
      .send(badArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: invalid types (article_img_url is not a string)", () => {
    const badArticle = {
      author: "butter_bridge",
      title: "Bad img url type",
      body: "valid body",
      topic: "coding",
      article_img_url: 999,
    };

    return request(app)
      .post("/api/articles")
      .send(badArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: author does not exist", () => {
    const newArticle = {
      author: "not_a_real_user",
      title: "Unknown author",
      body: "hello",
      topic: "coding",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("404: topic does not exist", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Unknown topic",
      body: "hello",
      topic: "not-a-topic",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("DELETE /api/articles/:article_id", () => {
  test("204: deletes an article by id and responds with no content", () => {
    return request(app)
      .delete("/api/articles/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("404: valid id but article does not exist", () => {
    return request(app)
      .delete("/api/articles/999999")
      .expect(404);
  });

  test("400: invalid article_id", () => {
    return request(app)
      .delete("/api/articles/not-an-id")
      .expect(400);
  });

  test("204: deleting an article also deletes its respective comments (cascade)", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBeGreaterThan(0);
      })
      .then(() => request(app).delete("/api/articles/1").expect(204))
      .then(() => {
        return request(app).get("/api/articles/1").expect(404);
      })
      .then(() => {
        return request(app).get("/api/articles/1/comments").expect(404);
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes a comment by id and responds with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("404: valid id but comment does not exist", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404);
  });

  test("400: invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400);
  });

  test("204 then 404: deleting the same comment twice", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then(() => request(app).delete("/api/comments/2").expect(404));
  });
});

