const { getTopics } = require("../services/topics.service");

exports.getTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
