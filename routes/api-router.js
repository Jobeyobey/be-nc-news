const apiRouter = require("express").Router();
const {
    usersRouter,
    topicsRouter,
    articlesRouter,
    commentsRouter,
} = require("./sub-routes");
const { getEndpoints } = require("../controllers/app-controller");

apiRouter.get("/", getEndpoints);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = {apiRouter};
