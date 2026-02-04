const router = require("express").Router();
const {
  getComments,
  deleteComment,
} = require("../controllers/comments.controller");

router.get("/", getComments);
router.delete("/:comment_id", deleteComment);
module.exports = router;
