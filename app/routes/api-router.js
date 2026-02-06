const router = require("express").Router();

const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");

router.use("/articles", articlesRouter);
router.use("/topics", topicsRouter);
router.use("/users", usersRouter);
router.use("/comments", commentsRouter);

module.exports = router;
