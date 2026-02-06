const router = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");

router.get("/", getTopics);

module.exports = router;

