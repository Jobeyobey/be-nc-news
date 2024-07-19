const commentsRouter = require("express").Router();
const {
    removeCommentById,
    patchCommentById,
} = require("../../controllers/comments-controller");

commentsRouter.route("/:comment_id")
    .patch(patchCommentById)
    .delete(removeCommentById);

module.exports = commentsRouter;
