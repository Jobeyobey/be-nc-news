const {
    selectArticles,
    selectArticleById,
    insertArticle,
    updateArticleById,
    deleteArticleById,
} = require("../models/articles-model.js");
const {
    countArticles,
    checkArticleExists,
    checkUsernameExists,
    checkTopicExists,
} = require("../models/model-utils.js");
const { checkNums } = require("./controller-utils.js");

exports.getArticles = (req, res, next) => {
    let { topic, sort_by, order, limit, page } = req.query;
    if (sort_by) sort_by = sort_by.toLowerCase();
    if (order) order = order.toUpperCase();
    if (topic) topic = topic.toLowerCase();

    checkNums([limit, page])
        .then(() => checkTopicExists(topic))
        .then(() => countArticles(topic))
        .then((article_count) => selectArticles(topic, sort_by, order, limit, page, article_count))
        .then(([articles, article_count]) => {
            res.status(200).send({ articles, article_count })
        })
        .catch(next);
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    checkArticleExists(article_id)
        .then(() => selectArticleById(article_id))
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next);
};

exports.postArticle = (req, res, next) => {
    const { title, topic, author, body, article_img_url } = req.body;

    checkUsernameExists(author)
        .then(() => insertArticle(title, topic, author, body, article_img_url))
        .then((postedArticle) => selectArticleById(postedArticle.article_id))
        .then((article) => {
            res.status(201).send({ article })
        })
        .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    checkNums([inc_votes])
        .then(() => checkArticleExists(article_id))
        .then(() => updateArticleById(article_id, inc_votes))
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next);
};

exports.removeArticleById = (req, res, next) => {
    const { article_id } = req.params;
    checkArticleExists(article_id)
        .then(() => deleteArticleById(article_id))
        .then(() => {
            res.status(204).send()
        })
        .catch(next);
};
