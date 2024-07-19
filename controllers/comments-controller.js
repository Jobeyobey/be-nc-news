const {
    checkArticleExists,
    checkUsernameExists,
    checkCommentExists,
    countComments,
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
    const { limit, page } = req.query;

    checkNums([limit, page])
        .then(() => checkArticleExists(article_id))
        .then(() => countComments(article_id))
        .then((comment_count) =>
            selectCommentsByArticleId(article_id, limit, page, comment_count)
        )
        .then(([comments, comment_count]) => {
            res.status(200).send({ comments, comment_count });
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
