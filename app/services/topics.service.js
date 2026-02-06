const { selectTopics } = require("../models/topics.model");
exports.getTopics = () => selectTopics();
