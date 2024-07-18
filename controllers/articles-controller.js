const {
    selectArticles,
    selectArticleById,
    updateArticleById,
} = require("../models/articles-model.js");
const { checkArticleExists } = require("../models/model-utils.js");
const { checkVotesIsNum } = require("./controller-utils.js");

exports.getArticles = (req, res, next) => {
    let { topic, sort_by, order } = req.query;
    if (sort_by) sort_by = sort_by.toLowerCase();
    if (order) order = order.toUpperCase();
    if (topic) topic = topic.toLowerCase();

    selectArticles(topic, sort_by, order).then((articles) => {
        res.status(200).send({ articles });
    });
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    checkArticleExists(article_id)
        .then(() => {
            selectArticleById(article_id).then((article) => {
                res.status(200).send({ article });
            });
        })
        .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    if (inc_votes && isNaN(inc_votes)) {
        next({ status: 400, msg: "inc_votes is NaN" });
    }
    checkVotesIsNum(inc_votes)
        .then(() => {
            return checkArticleExists(article_id);
        })
        .then(() => {
            return updateArticleById(article_id, inc_votes);
        })
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
};
