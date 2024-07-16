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
    test("GET200: Sends an array of topics to the client, each topic with properties: slug, description", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
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
    test("GET200: returned articles are ordered by date descending", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
});

describe("/api/articles/:article_id", () => {
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
                expect(body.msg).toBe("invalid article id");
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

describe("/api/articles/:article_id/comments", () => {
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
});

describe("Generic error handling", () => {
    test("GET404: should respond with a 404 error if endpoint doesn't exist", () => {
        return request(app).get("/api/no-endpoint").expect(404);
    });
});
