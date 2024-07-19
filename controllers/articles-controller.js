const {
    selectArticles,
    selectArticleById,
    insertArticle,
    updateArticleById,
} = require("../models/articles-model.js");
const {
    countArticles,
    checkArticleExists,
    checkUsernameExists,
} = require("../models/model-utils.js");
const { checkNums } = require("./controller-utils.js");

exports.getArticles = (req, res, next) => {
    let { topic, sort_by, order, limit, page } = req.query;
    if (sort_by) sort_by = sort_by.toLowerCase();
    if (order) order = order.toUpperCase();
    if (topic) topic = topic.toLowerCase();

    checkNums([limit, page])
        .then(() => {
            return Promise.all([
                countArticles(topic),
                selectArticles(topic, sort_by, order, limit, page),
            ]);
        })
        .then(([articleCount, articles]) =>
            res.status(200).send({ articleCount, articles })
        )
        .catch(next);
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

exports.postArticle = (req, res, next) => {
    const { title, topic, author, body, article_img_url } = req.body;

    checkUsernameExists(author)
        .then(() => {
            return insertArticle(title, topic, author, body, article_img_url);
        })
        .then((postedArticle) => {
            return selectArticleById(postedArticle.article_id);
        })
        .then((article) => {
            res.status(201).send({ article });
        })
        .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    checkNums([inc_votes])
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
