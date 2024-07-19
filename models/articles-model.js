const db = require("../db/connection");

exports.selectArticles = (
    topic,
    sort_by,
    order,
    limit = 10,
    page,
    article_count
) => {
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

    if (limit <= 0) limit = 10;
    selectQuery += ` GROUP BY articles.article_id
                    ORDER BY ${sort_by} ${order}
                    LIMIT ${limit}`;

    if (page <= 0) page = 0;
    let offset = page;
    if (offset) {
        offset = limit * (offset - 1);

        // if offset takes us past last page, set offset to show last page
        if (offset >= article_count) {
            offset = article_count - (article_count % limit);
        }
        selectQuery += ` OFFSET ${offset}`;
    }

    return db.query(selectQuery, queries).then(({ rows }) => {
        return Promise.all([rows, article_count]);
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

exports.insertArticle = (title, topic, author, body, article_img_url) => {
    const insertParams = [title, topic, author, body];

    let insertQuery = `INSERT INTO articles `;

    if (article_img_url) {
        insertQuery += `
                            (title, topic, author, body, article_img_url)
                        VALUES
                            ($1, $2, $3, $4, $5)
                        RETURNING *`;
        insertParams.push(article_img_url);
    } else {
        insertQuery += `
                            (title, topic, author, body)
                        VALUES
                            ($1, $2, $3, $4)
                        RETURNING *`;
    }

    return db.query(insertQuery, insertParams).then(({ rows }) => {
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

exports.deleteArticleById = (article_id) => {
    return db.query(
        `DELETE FROM articles
        WHERE article_id = $1`,
        [article_id]
    );
};
