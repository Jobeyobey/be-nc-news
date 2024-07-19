const db = require("../db/connection");

exports.checkTopicExists = (topic) => {
    queries = [];
    let selectQuery = `SELECT * FROM topics`;

    if (topic) {
        selectQuery += ` WHERE slug = $1`;
        queries.push(topic);
    }

    return db.query(selectQuery, queries).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "topic not found" });
        } else {
            return true;
        }
    });
};

exports.checkArticleExists = (article_id) => {
    return db
        .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "article id not found",
                });
            } else {
                return true;
            }
        });
};

exports.checkUsernameExists = (username) => {
    return db
        .query("SELECT * FROM users WHERE username = $1", [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "username not found",
                });
            } else {
                return true;
            }
        });
};

exports.checkCommentExists = (comment_id) => {
    return db
        .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "comment not found",
                });
            } else {
                return true;
            }
        });
};

exports.countArticles = (topic) => {
    const params = [];
    let selectQuery = `SELECT count(*)::INT FROM articles`;
    if (topic) {
        selectQuery += ` WHERE topic = $1`;
        params.push(topic);
    }

    return db.query(selectQuery, params).then(({ rows }) => {
        return rows[0].count;
    });
};

exports.countComments = (article_id) => {
    const params = [];
    let selectQuery = `SELECT count(*)::INT FROM comments`;
    if (article_id) {
        selectQuery += ` WHERE article_id = $1`;
        params.push(article_id);
    }

    return db.query(selectQuery, params).then(({ rows }) => {
        return rows[0].count;
    });
};
