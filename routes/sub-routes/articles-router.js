const articlesRouter = require("express").Router();
const {
    getArticles,
    postArticle,
    getArticleById,
    patchArticleById,
    removeArticleById,
} = require("../../controllers/articles-controller");
const {
    getCommentsByArticleId,
    postCommentByArticleId,
} = require("../../controllers/comments-controller");

articlesRouter
    .route("/")
    .get(getArticles)
    .post(postArticle);

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleById)
    .delete(removeArticleById);

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId);

module.exports = articlesRouter;
