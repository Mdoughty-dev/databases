const router = require("express").Router();

const {
  deleteCommentById,
patchCommentById
} = require("../controllers/comments.controller");

router.delete("/:comment_id", deleteCommentById);
router.patch("/:comment_id", patchCommentById);
module.exports = router;

