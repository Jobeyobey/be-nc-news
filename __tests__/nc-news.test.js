const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
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
