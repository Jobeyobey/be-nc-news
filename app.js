const express = require("express");
const app = express();
const cors = require("cors");
const { apiRouter } = require("./routes/api-router");
const {
    psqlErrorHandlers,
    customErrorHandler,
    serverErrorHandler,
} = require("./error-handlers");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
    res.status(404).send({ msg: "404: Endpoint not found" });
});

app.use(psqlErrorHandlers);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
