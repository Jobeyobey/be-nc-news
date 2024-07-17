const express = require("express");
const app = express();
const {
    apiRouter,
    usersRouter,
    topicsRouter,
    articlesRouter,
    commentsRouter,
} = require("./routes");
const {
    psqlErrorHandlers,
    customErrorHandler,
    serverErrorHandler,
} = require("./error-handlers");

app.use(express.json());

app.use("/api", apiRouter);

app.use("/api/users", usersRouter);

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/comments", commentsRouter);

app.use(psqlErrorHandlers);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
