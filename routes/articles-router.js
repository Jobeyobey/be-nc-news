const articlesRouter = require("express").Router();
const {
    getArticles,
    getArticleById,
    patchArticleById,
} = require("../controllers/articles-controller");
const {
    getCommentsByArticleId,
    postCommentByArticleId,
} = require("../controllers/comments-controller");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);

articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postCommentByArticleId);

module.exports = articlesRouter;
