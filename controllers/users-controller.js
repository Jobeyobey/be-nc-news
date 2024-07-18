const { checkUsernameExists } = require("../models/model-utils");
const { selectUsers, selectUserByUsername } = require("../models/users-model");

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({ users });
    });
};

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    checkUsernameExists(username)
        .then(() => {
            return selectUserByUsername(username);
        })
        .then((user) => {
            res.status(200).send({ user });
        })
        .catch(next);
};
