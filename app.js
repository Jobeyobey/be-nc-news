const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/app-controller");
const { getTopics } = require("./controllers/topics-controller");
const { serverErrorHandler } = require("./error-handlers");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.use(serverErrorHandler);

module.exports = app;
