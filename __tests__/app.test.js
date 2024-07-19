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
    describe("GET", () => {
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
    describe("POST", () => {
        test("POST201: responds with the newly created topic object, matching the posted object", () => {
            return request(app)
                .post("/api/topics")
                .send({
                    slug: "northcoders",
                    description: "all about Northcoders",
                })
                .expect(201)
                .then(({ body }) => {
                    expect(body.topic).toEqual({
                        slug: "northcoders",
                        description: "all about Northcoders",
                    });
                });
        });
        test("POST201: allows posting a new topic without a description", () => {
            return request(app)
                .post("/api/topics")
                .send({ slug: "indescribable" })
                .expect(201)
                .then(({ body }) => {
                    expect(body.topic).toEqual({
                        slug: "indescribable",
                        description: null,
                    });
                });
        });
        test("POST400: responds with an appropriate error and message when attempting to post without a slug property", () => {
            return request(app)
                .post("/api/topics")
                .send({ desciption: "no slug" })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("input can't be null or undefined");
                });
        });
        test("POST400: responds with an appropriate error and message when attempting to post without a valid slug value", () => {
            return request(app)
                .post("/api/topics")
                .send({ slug: "", description: "sneaky" })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("slug must contain text");
                });
        });
    });
});

describe("/api/articles", () => {
    describe("GET", () => {
        test("GET200: Returns an object, with an 'articles' property that is an array, and an 'articles_count' that is an integer, representing the total count of articles matching available", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    expect(Array.isArray(body.articles)).toBe(true);
                    expect(body.article_count).toBe(13);
                });
        });
        test("GET200: articles array contains articles objects, default limited to 10. Each article has the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;
                    expect(articles).toHaveLength(10);
                    articles.forEach((article) => {
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
        test("GET200: articlesData.articlesCount is equal to the total number of articles in the database that match the query", () => {});
    });
    describe("POST", () => {
        test("POST201: responds with the posted article, with the original properties as well as: article_id, votes, created_at, comment_count", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                })
                .expect(201)
                .then(({ body }) => {
                    expect(body.article).toEqual({
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        article_img_url:
                            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                        article_id: 14,
                        votes: 0,
                        created_at: expect.any(String),
                        comment_count: 0,
                    });
                });
        });
        test("POST201: uses the default article_img_url if not provided", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                })
                .expect(201)
                .then(({ body }) => {
                    expect(body.article.article_img_url).toBe(
                        "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
                    );
                });
        });
        test("POST400: responds with appropriate error and message when article is missing a required property", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("input can't be null or undefined");
                });
        });
        test("POST400: responds with appropriate error and message when any properties are null", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    title: null,
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("input can't be null or undefined");
                });
        });
        test("POST404: responds with appropriate error and message when author does not match an existing username", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "not_a_user",
                    body: "I find this existence challenging",
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("username not found");
                });
        });
    });
    describe("Article queries", () => {
        test("GET200: including a 'topic' query for a valid topic returns a filtered array of articles, consisting only of the queried topic", () => {
            return request(app)
                .get("/api/articles?topic=mitch")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;
                    expect(articles).toHaveLength(10);
                    articles.forEach((article) => {
                        expect(article.topic).toBe("mitch");
                    });
                });
        });
        test("GET404: returns an error when searching for a topic that doesn't exist", () => {
            return request(app)
                .get("/api/articles?topic=aliens")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("topic not found");
                });
        });
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
        test("GET200: including a 'limit' query limits returned articles to that number", () => {
            return request(app)
                .get("/api/articles?limit=5")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toHaveLength(5);
                });
        });
        test("GET200: defaults 'limit' to 10 if 'limit' is not a positive number", () => {
            return request(app)
                .get("/api/articles?limit=-1")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toHaveLength(10);
                });
        });
        test("GET400: returns an appropriate error and message when 'limit' is not an integer", () => {
            return request(app)
                .get("/api/articles?limit=ten")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('"ten" is NaN');
                });
        });
        test("GET200: including a 'page' query specifies the page at which to start, calculated using limit. (e.g. limit 5, page 2, would begin at article 6)", () => {
            return request(app)
                .get("/api/articles?limit=3&page=4")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;
                    expect(articles[0].article_id).toBe(4);
                    expect(articles[1].article_id).toBe(8);
                    expect(articles[2].article_id).toBe(11);
                });
        });
        test("GET200: defaults 'page' to 0 if 'page' is not a positive integer", () => {
            return request(app)
                .get("/api/articles?page=-1")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;
                    expect(articles[0].article_id).toBe(3);
                    expect(articles[1].article_id).toBe(6);
                    expect(articles[2].article_id).toBe(2);
                    expect(articles[3].article_id).toBe(12);
                    expect(articles[4].article_id).toBe(13);
                    expect(articles[5].article_id).toBe(5);
                    expect(articles[6].article_id).toBe(1);
                    expect(articles[7].article_id).toBe(9);
                    expect(articles[8].article_id).toBe(10);
                    expect(articles[9].article_id).toBe(4);
                });
        });
        test("GET200: returns last page of articles when 'page' query takes user past total number of articles", () => {
            return request(app)
                .get("/api/articles?page=999")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;
                    expect(articles[0].article_id).toBe(8);
                    expect(articles[1].article_id).toBe(11);
                    expect(articles[2].article_id).toBe(7);
                });
        });
        test("GET400: returns an appropriate error and message when 'page' is not an integer", () => {
            return request(app)
                .get("/api/articles?page=two")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('"two" is NaN');
                });
        });
    });
});

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        test("GET200: sends an article object to the client with following properties: author, title, article_id, body, topic, created_at, votes, article_img_url, comment_count", () => {
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
                        comment_count: 11,
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
                    expect(body.msg).toBe("article id not found");
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
                    expect(body.msg).toBe('"ten" is NaN');
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
                    expect(body.msg).toBe("article id not found");
                });
        });
    });
    describe("DELETE", () => {
        test("DELETE204: successfully deletes the article and its respective comments, returning no content", () => {
            return request(app)
                .delete("/api/articles/1")
                .expect(204)
                .then(({ body }) => {
                    expect(body).toEqual({});
                })
                .then(() => {
                    const articleQuery = db
                        .query("SELECT * FROM articles WHERE article_id = 1")
                        .then(({ rows }) => rows);
                    const commentQuery = db
                        .query("SELECT * FROM comments WHERE article_id = 1")
                        .then(({ rows }) => rows);
                    return Promise.all([articleQuery, commentQuery]);
                })
                .then(([articleQuery, commentQuery]) => {
                    expect(articleQuery).toHaveLength(0);
                    expect(commentQuery).toHaveLength(0);
                });
        });
        test("DELETE400: responds with appropriate error message when article_id is not a valid id", () => {
            return request(app)
                .delete("/api/articles/not-an-id")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("invalid id");
                });
        });
        test("DELETE404: responds with an appropriate error and message when article_id is valid but does not exist", () => {
            return request(app)
                .delete("/api/articles/999")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("article id not found");
                });
        });
    });
});

describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
        test("GET200: Returns an object, with an 'comments' property that is an array, and an 'comment_count' that is an integer representing the total comments on that article", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(Array.isArray(body.comments)).toBe(true);
                    expect(body.comment_count).toBe(11);
                });
        });
        test("GET200: 'comments' is an array of comment objects (default limited to 10) for the given article_id, each with the following properties: comment_id, votes, created_at, author, body, article_id", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toHaveLength(10);
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
                    expect(body.msg).toBe("article id not found");
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
        test("POST400: responds with appropriate error and message when comment object has a missing a property", () => {
            return request(app)
                .post("/api/articles/7/comments")
                .send({
                    username: "butter_bridge",
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("input can't be null or undefined");
                });
        });
        test("POST400: responds with appropriate error and message when body is null", () => {
            return request(app)
                .post("/api/articles/7/comments")
                .send({
                    username: "butter_bridge",
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
                    expect(body.msg).toBe("article id not found");
                });
        });
        test("POST404: responds with appropriate error and message when username in body of request does not exist", () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "not-a-username", body: "I'm an imposter!" })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("username not found");
                });
        });
    });
    describe("Comment queries", () => {
        test("GET200: including a 'limit' query limits returned comments to that number", () => {
            return request(app)
                .get("/api/articles/1/comments?limit=5")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toHaveLength(5);
                });
        });
        test("GET200: defaults 'limit' to 10 if 'limit' is not a positive integer", () => {
            return request(app)
                .get("/api/articles/1/comments?limit=-1")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toHaveLength(10);
                });
        });
        test("GET400: returns appropriate error and message when 'limit' is not an integer", () => {
            return request(app)
                .get("/api/articles/1/comments?limit=five")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('"five" is NaN');
                });
        });
        test("GET200: including a 'page' query specifies the page at which to start, calculated using limit. (e.g. limit 5, page 2, would begin at comment 6)", () => {
            return request(app)
                .get("/api/articles/1/comments?limit=3&page=3")
                .expect(200)
                .then(({ body }) => {
                    const comments = body.comments;
                    expect(comments[0].comment_id).toBe(6);
                    expect(comments[1].comment_id).toBe(12);
                    expect(comments[2].comment_id).toBe(3);
                });
        });
        test("GET200: defaults 'page' to 0 if 'page' is not a positive integer", () => {
            return request(app)
                .get("/api/articles/1/comments?page=-1")
                .expect(200)
                .then(({ body }) => {
                    const comments = body.comments;
                    expect(comments[0].comment_id).toBe(5);
                    expect(comments[1].comment_id).toBe(2);
                    expect(comments[2].comment_id).toBe(18);
                    expect(comments[3].comment_id).toBe(13);
                    expect(comments[4].comment_id).toBe(7);
                    expect(comments[5].comment_id).toBe(8);
                    expect(comments[6].comment_id).toBe(6);
                    expect(comments[7].comment_id).toBe(12);
                    expect(comments[8].comment_id).toBe(3);
                    expect(comments[9].comment_id).toBe(4);
                });
        });
        test("GET200: returns last page of comments when 'page' query takes user past total number of comments", () => {
            return request(app)
                .get("/api/articles/1/comments?page=9999")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments[0].comment_id).toBe(9);
                });
        });
        test("GET400: returns an appropriate error and message when 'page' is not an integer", () => {
            return request(app)
                .get("/api/articles/1/comments?page=two")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('"two" is NaN');
                });
        });
    });
});

describe("/api/comments/:comment_id", () => {
    describe("PATCH", () => {
        test("PATCH200: updates and returns the updated comment", () => {
            return request(app)
                .patch("/api/comments/2")
                .send({ inc_votes: 1 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.comment).toEqual({
                        comment_id: 2,
                        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                        article_id: 1,
                        author: "butter_bridge",
                        votes: 15,
                        created_at: "2020-10-31T03:03:00.000Z",
                    });
                });
        });
        test("PATCH400: responds with appropriate error and message if patch request body does not include a 'inv_votes' property", () => {
            return request(app)
                .patch("/api/comments/2")
                .send({ increase_votes: 1 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("input can't be null or undefined");
                });
        });
        test("PATCH400: responds with appropriate error and message if inc_votes property is NaN", () => {
            return request(app)
                .patch("/api/comments/2")
                .send({ inc_votes: "ten" })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('"ten" is NaN');
                });
        });
        test("PATCH400: responds with appropriate error and message if comment_id is not a valid id", () => {
            return request(app)
                .patch("/api/comments/not-an-id")
                .send({ inc_votes: 1 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("invalid id");
                });
        });
        test("PATCH404: responds with appropriate error and message if comment_id is valid but does not exist", () => {
            return request(app)
                .patch("/api/comments/98412")
                .send({ inc_votes: 1 })
                .then(({ body }) => {
                    expect(body.msg).toBe("comment not found");
                });
        });
    });
    describe("DELETE", () => {
        test("DELETE204: successfully deletes comment by id, returning no content", () => {
            return request(app)
                .delete("/api/comments/5")
                .expect(204)
                .then(({ body }) => {
                    expect(body).toEqual({});
                    return db.query(
                        `SELECT * FROM comments WHERE comment_id = 5`
                    );
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
                    expect(body.msg).toBe("comment not found");
                });
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

describe("/api/users/:username", () => {
    test("GET200: if username exists, sends a user object to the client with properties: username, name, avatar_url", () => {
        return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
                expect(body.user).toMatchObject({
                    username: "butter_bridge",
                    name: "jonny",
                    avatar_url:
                        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                });
            });
    });
    test("GET404: sends an appropriate error and message when given a username that doesn't exist", () => {
        return request(app)
            .get("/api/users/not_a_user")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("username not found");
            });
    });
});

describe("Generic error handling", () => {
    test("GET404: should respond with a 404 error if endpoint doesn't exist", () => {
        return request(app).get("/api/no-endpoint").expect(404);
    });
});
