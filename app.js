const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/app-controller");
const { getTopics } = require("./controllers/topics-controller");
const {
    getArticles,
    getArticleById,
    getCommentsByArticleId,
    postCommentByArticleId,
} = require("./controllers/articles-controller");
const {
    psqlErrorHandlers,
    customErrorHandler,
    serverErrorHandler,
} = require("./error-handlers");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.use(psqlErrorHandlers);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
