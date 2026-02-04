const router = require("express").Router();
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");

router.get("/", (req, res) => {
  res.status(200).send({ msg: "ok" });
});

router.use("/articles", articlesRouter);
router.use("/topics", topicsRouter);
router.use("/users", usersRouter);
router.use("/comments", commentsRouter);
module.exports = router;
