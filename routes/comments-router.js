const commentsRouter = require("express").Router();
const {
    removeCommentById,
    patchCommentById,
} = require("../controllers/comments-controller");

commentsRouter.patch("/:comment_id", patchCommentById);
commentsRouter.delete("/:comment_id", removeCommentById);

module.exports = commentsRouter;
