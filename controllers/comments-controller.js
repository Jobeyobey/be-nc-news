const {
    checkArticleExists,
    checkUsernameExists,
    checkCommentExists,
} = require("../models/model-utils");
const {
    selectCommentsByArticleId,
    insertCommentByArticleId,
    updateCommentById,
    deleteCommentById,
} = require("../models/comments-model");
const { checkNums } = require("./controller-utils");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    checkArticleExists(article_id)
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

    checkArticleExists(article_id)
        .then(() => {
            return checkUsernameExists(username);
        })
        .then(() => {
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

exports.patchCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    checkNums([inc_votes])
        .then(() => {
            return checkCommentExists(comment_id);
        })
        .then(() => {
            return updateCommentById(inc_votes, comment_id);
        })
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch(next);
};

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    deleteCommentById(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};
