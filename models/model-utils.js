const db = require("../db/connection");

afterAll(() => {
    db.end();
});

exports.checkArticleExistsById = (article_id) => {
    return db
        .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return false;
            } else {
                return true;
            }
        });
};
