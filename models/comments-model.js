const db = require("../db/connection");

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

exports.insertCommentByArticleId = (commentToPost) => {
    return db
        .query(
            `INSERT INTO comments
            (article_id, author, body)
        VALUES
            ($1, $2, $3)
        RETURNING *`,
            commentToPost
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.updateCommentById = (inc_votes, comment_id) => {
    return db
        .query(
            `UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *`,
            [inc_votes, comment_id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.deleteCommentById = (comment_id) => {
    return db
        .query(
            `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`,
            [comment_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "comment not found",
                });
            }
        });
};
