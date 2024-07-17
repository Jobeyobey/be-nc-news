const db = require("../db/connection");

exports.selectArticles = (topic, sort_by, order) => {
    const queries = [];
    const sortGreenList = [
        "article_id",
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
    ];
    const orderGreenList = ["ASC", "DESC"];

    if (!sortGreenList.includes(sort_by)) {
        sort_by = "created_at";
    }
    if (!orderGreenList.includes(order)) {
        order = "DESC";
    }

    let selectQuery = `SELECT
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
            ON articles.article_id = comments.article_id`;

    if (topic) {
        selectQuery += ` WHERE topic = $1`;
        queries.push(topic);
    }

    selectQuery += ` GROUP BY articles.article_id
                    ORDER BY ${sort_by} ${order};`;

    return db.query(selectQuery, queries).then(({ rows }) => {
        return rows;
    });
};

exports.selectArticleById = (article_id) => {
    return db
        .query(
            `SELECT articles.*,
            COUNT(comments.article_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id`,
            [article_id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.updateArticleById = (article_id, inc_votes) => {
    const updateData = [article_id, inc_votes];
    return db
        .query(
            `UPDATE articles
            SET votes = votes + $2
            WHERE article_id = $1
            RETURNING *`,
            updateData
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
