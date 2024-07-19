const express = require("express");
const app = express();
const { apiRouter } = require("./routes/api-router");
const {
    psqlErrorHandlers,
    customErrorHandler,
    serverErrorHandler,
} = require("./error-handlers");

app.use(express.json());

app.use("/api", apiRouter);

app.use(psqlErrorHandlers);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
