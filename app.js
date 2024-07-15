const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/app-controller");
const { getTopics } = require("./controllers/topics-controller");
const {
    getArticles,
    getArticleById,
} = require("./controllers/articles-controller");
const {
    psqlErrorHandlers,
    customErrorHandler,
    serverErrorHandler,
} = require("./error-handlers");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.use(psqlErrorHandlers);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
