const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
    return db
        .query("SELECT * from articles WHERE article_id = $1", [article_id])
        .then((response) => {
            if (response.rows.length === 0) {
                console.log("MODEL 0");
                return Promise.reject({
                    status: 404,
                    msg: "article id does not exist",
                });
            }
            return response.rows[0];
        });
};
