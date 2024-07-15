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
    test("GET200: sends an array of topics to the client", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(body.topics).toEqual([
                    {
                        description: "The man, the Mitch, the legend",
                        slug: "mitch",
                    },
                    {
                        description: "Not dogs",
                        slug: "cats",
                    },
                    {
                        description: "what books are made of",
                        slug: "paper",
                    },
                ]);
            });
    });
    test("GET200: each topic from response has a slug and a description", () => {
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

describe("Generic error handling", () => {
    test("GET404: should respond with a 404 error if endpoint doesn't exist", () => {
        return request(app).get("/api/no-endpoint").expect(404);
    });
});
