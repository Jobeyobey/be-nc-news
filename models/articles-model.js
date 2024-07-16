const db = require("../db/connection");

exports.selectArticles = () => {
    return db
        .query(
            `SELECT
                articles.author,
                articles.title,
                articles.article_id,
                articles.topic,
                articles.created_at,
                articles.votes,
                articles.article_img_url,
                COUNT(comments.article_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY created_at DESC;`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectArticleById = (article_id) => {
    return db
        .query("SELECT * from articles WHERE article_id = $1", [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "article id does not exist",
                });
            }
            return rows[0];
        });
};

exports.selectCommentsByArticleId = (article_id) => {
    return db
        .query(
            `SELECT comments.*
             FROM comments
             LEFT JOIN articles
             ON comments.article_id = articles.article_id
             WHERE comments.article_id = $1
             ORDER BY created_at DESC`,
            [article_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};
