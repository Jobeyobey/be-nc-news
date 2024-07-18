const db = require("../db/connection");

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`).then(({ rows }) => {
        return rows;
    });
};

exports.selectUserByUsername = (username) => {
    return db
        .query(
            `SELECT username, name, avatar_url
        FROM users
        WHERE username = $1`,
            [username]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
