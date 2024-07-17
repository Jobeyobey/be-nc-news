const {
    selectArticles,
    selectArticleById,
    updateArticleById,
} = require("../models/articles-model.js");

exports.getArticles = (req, res, next) => {
    let { sort_by, order } = req.query;
    if (typeof sort_by === "string") {
        sort_by = sort_by.toLowerCase();
    }
    if (typeof order === "string") {
        order = order.toUpperCase();
    }

    selectArticles(sort_by, order).then((articles) => {
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
