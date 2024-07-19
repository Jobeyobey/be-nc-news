const db = require("../db/connection");

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;").then(({ rows }) => {
        return rows;
    });
};

exports.insertTopic = (slug, description) => {
    // Test slug is valid text (1 or more characters)
    if (!/^\w+$/.test(slug)) {
        return Promise.reject({ status: 400, msg: "slug must contain text" });
    }

    return db
        .query(
            `INSERT INTO topics
                (slug, description)
            VALUES
                ($1, $2)
            RETURNING *`,
            [slug, description]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
