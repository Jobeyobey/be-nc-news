const articlesRouter = require("express").Router();
const {
    getArticles,
    postArticle,
    getArticleById,
    patchArticleById,
    removeArticleById,
} = require("../controllers/articles-controller");
const {
    getCommentsByArticleId,
    postCommentByArticleId,
} = require("../controllers/comments-controller");

articlesRouter.get("/", getArticles);
articlesRouter.post("/", postArticle);

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.delete("/:article_id", removeArticleById);

articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postCommentByArticleId);

module.exports = articlesRouter;
