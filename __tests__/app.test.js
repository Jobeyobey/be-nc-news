const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
});

describe("/api", () => {
    test("GET200: sends an object with all available endpoints with documentation to the client", () => {
        request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body.endpoints).toEqual(endpoints);
            });
    });
});

describe("/api/topics", () => {
    test("GET200: Sends an array of all topics to the client, each topic with properties: slug, description", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(body.topics).toHaveLength(3);
                body.topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String),
                    });
                });
            });
    });
});

describe("/api/articles", () => {
    test("GET200: sends an array of all articles to the client, each with the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(13);
                body.articles.forEach((article) => {
                    expect(article).toEqual({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number),
                    });
                });
            });
    });
    test("GET200: returned article comment_count correctly counts number of article comments", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                body.articles.forEach((article) => {
                    switch (article.article_id) {
                        case 1:
                            expect(article.comment_count).toBe(11);
                            break;
                        case 3:
                            expect(article.comment_count).toBe(2);
                            break;
                        case 5:
                            expect(article.comment_count).toBe(2);
                            break;
                        case 6:
                            expect(article.comment_count).toBe(1);
                            break;
                        case 9:
                            expect(article.comment_count).toBe(2);
                            break;
                        default:
                            expect(article.comment_count).toBe(0);
                    }
                });
            });
    });
    test("GET200: returned articles are ordered by date descending by default", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
    describe("Article queries", () => {
        test("GET200: including a 'sort_by' query for a valid column returns articles in descending order of that column", () => {
            return request(app)
                .get("/api/articles?sort_by=votes")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("votes", {
                        descending: true,
                    });
                });
        });
        test("GET200: including a 'order_by' query of 'asc' sorts articles in ascending order", () => {
            return request(app)
                .get("/api/articles?order=asc")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at");
                });
        });
        test("GET200: including an invalid 'order_by' query defaults to order by descending", () => {
            return request(app)
                .get("/api/articles?sort_by=author&order=tallest-first")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("author", {
                        descending: true,
                    });
                });
        });
        test("GET200: including an invalid 'sort_by' query defaults to sort by created_at", () => {
            return request(app)
                .get("/api/articles?sort_by=popular&order=asc")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at");
                });
        });
    });
});

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        test("GET200: sends an article object to the client with following properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toEqual({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: "2020-07-09T20:11:00.000Z",
                        votes: 100,
                        article_img_url:
                            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    });
                });
        });
        test("GET400: sends an appropriate status and error message when given an invalid article id", () => {
            return request(app)
                .get("/api/articles/not-an-id")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("invalid id");
                });
        });
        test("GET404: sends appropriate status and error message when given a valid but non-existent article id", () => {
            return request(app)
                .get("/api/articles/99357")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("article id does not exist");
                });
        });
    });
    describe("PATCH", () => {
        test("PATCH200: updates and returns the specified article", () => {
            return request(app)
                .patch("/api/articles/8")
                .send({ inc_votes: 50 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toEqual({
                        author: "icellusedkars",
                        title: "Does Mitch predate civilisation?",
                        body: "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
                        article_id: 8,
                        topic: "mitch",
                        created_at: "2020-04-17T01:08:00.000Z",
                        votes: 50,
                        article_img_url:
                            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    });
                });
        });
        test("PATCH400: responds with appropriate error and message if patch request body does not include a 'inc_votes' property", () => {
            return request(app)
                .patch("/api/articles/8")
                .send({ increase_votes: 10 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("input can't be null or undefined");
                });
        });
        test("PATCH400: responds with appropriate error and message if inc_votes property is NaN", () => {
            return request(app)
                .patch("/api/articles/8")
                .send({ inc_votes: "ten" })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("inc_votes is NaN");
                });
        });
        test("PATCH400: responds with appropriate error message if article_id is not a valid id", () => {
            return request(app)
                .patch("/api/articles/not-an-id")
                .send({ inc_votes: 50 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("invalid id");
                });
        });
        test("PATCH404: responds with appropriate error message if article_id is valid but does not exist", () => {
            return request(app)
                .patch("/api/articles/9959")
                .send({ inc_votes: 50 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("article id does not exist");
                });
        });
    });
});

describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
        test("GET200: sends an array of all comments for the given article_id to the client, each with the following properties: comment_id, votes, created_at, author, body, article_id", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toHaveLength(11);
                    body.comments.forEach((comment) => {
                        expect(comment).toEqual({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            article_id: expect.any(Number),
                        });
                    });
                });
        });
        test("GET200: comments are returned with most recent comments first", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toBeSortedBy("created_at", {
                        descending: true,
                    });
                });
        });
        test("GET200: returns an empty array without an error when article exists, but there are no comments", () => {
            return request(app)
                .get("/api/articles/10/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toEqual([]);
                });
        });
        test("GET400: sends an appropriate status and error message when given an invalid article id", () => {
            return request(app)
                .get("/api/articles/not-an-id/comments")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("invalid id");
                });
        });
        test("GET404: sends an appropriate status and error message when given a valid but non-existent article id", () => {
            return request(app)
                .get("/api/articles/99995/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("article id does not exist");
                });
        });
    });
    describe("POST", () => {
        test("POST201: responds with the posted comment, when comment object is valid", () => {
            return request(app)
                .post("/api/articles/7/comments")
                .send({
                    username: "butter_bridge",
                    body: "wwwwwaaaaadddsssssss   wasdwhy can't I move",
                })
                .expect(201)
                .then(({ body }) => {
                    expect(body.comment).toEqual({
                        comment_id: 19,
                        votes: 0,
                        created_at: expect.any(String),
                        author: "butter_bridge",
                        body: "wwwwwaaaaadddsssssss   wasdwhy can't I move",
                        article_id: 7,
                    });
                });
        });
        test("POST400: responds with appropriate error and message when comment object has a missing property", () => {
            return request(app)
                .post("/api/articles/7/comments")
                .send({
                    username: "butter_bridge",
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe(
                        "request body is not a valid comment object"
                    );
                });
        });
        test("POST400: rejects post and responds with appropriate error and message when comment object has unexpected properties", () => {
            return request(app)
                .post("/api/articles/7/comments")
                .send({
                    username: "butter_bridge",
                    body: "comment body",
                    otherProp: true,
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe(
                        "request body is not a valid comment object"
                    );
                });
        });
        test("POST400: responds with appropriate error and message when username or body is null", () => {
            return request(app)
                .post("/api/articles/7/comments")
                .send({
                    username: null,
                    body: null,
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("input can't be null or undefined");
                });
        });
        test("POST400: responds with appropriate error and message when article_id parameter is not valid", () => {
            return request(app)
                .post("/api/articles/not-an-id/comments")
                .send({
                    username: "butter_bridge",
                    body: "I love valid comments!",
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("invalid id");
                });
        });
        test("POST404: responds with appropriate error and message when article that comment is posted to does not exist", () => {
            return request(app)
                .post("/api/articles/991/comments")
                .send({
                    username: "butter_bridge",
                    body: "I love valid comments!",
                })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("article id does not exist");
                });
        });
    });
});

describe("/api/comments/:comment_id", () => {
    test("DELETE204: successfully deletes comment by id, returning no content", () => {
        return request(app)
            .delete("/api/comments/5")
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({});
                return db.query(`SELECT * FROM comments WHERE comment_id = 5`);
            })
            .then(({ rows }) => {
                expect(rows).toHaveLength(0);
            });
    });
    test("DELETE400: responds with appropriate error message when comment_id is not a valid id", () => {
        return request(app)
            .delete("/api/comments/not-valid-id")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid id");
            });
    });
    test("DELETE404: responds with appropriate error message when comment_id is valid but doesn't exist", () => {
        return request(app)
            .delete("/api/comments/98327")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("comment does not exist");
            });
    });
});

describe("/api/users", () => {
    test("GET200: sends an array of all users to the client, each user with properties: username, name, avatar_url", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                expect(body.users).toHaveLength(4);
                body.users.forEach((user) => {
                    expect(user).toEqual({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    });
                });
            });
    });
});

describe("Generic error handling", () => {
    test("GET404: should respond with a 404 error if endpoint doesn't exist", () => {
        return request(app).get("/api/no-endpoint").expect(404);
    });
});
