const {
    selectArticles,
    selectArticleById,
    selectCommentsByArticleId,
    insertCommentByArticleId,
    updateArticleById,
} = require("../models/articles-model.js");

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles });
    });
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    if (inc_votes && isNaN(inc_votes)) {
        next({ status: 400, msg: "inc_votes is NaN" });
    }

    selectArticleById(article_id)
        .then(() => {
            return updateArticleById(article_id, inc_votes);
        })
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
};

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
