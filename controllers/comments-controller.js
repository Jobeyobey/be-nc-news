const { selectArticleById } = require("../models/articles-model");
const {
    selectCommentsByArticleId,
    insertCommentByArticleId,
    deleteCommentById,
} = require("../models/comments-model");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then(() => {
            return selectCommentsByArticleId(article_id);
        })
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    // Check comment is valid
    if (
        username === undefined ||
        body === undefined ||
        Object.keys(req.body).length > 2
    ) {
        next({
            status: 400,
            msg: "request body is not a valid comment object",
        });
    }

    // Check article exists
    selectArticleById(article_id)
        .then(() => {
            // Post comment
            const commentToPost = [article_id, username, body];
            return insertCommentByArticleId(commentToPost);
        })
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    deleteCommentById(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};
