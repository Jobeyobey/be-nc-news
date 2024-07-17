const db = require("../db/connection");

exports.checkArticleExists = (article_id) => {
    return db
        .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "article id does not exist",
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
                    msg: "username does not exist",
                });
            } else {
                return true;
            }
        });
};
