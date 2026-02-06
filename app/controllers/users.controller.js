const { getUsers } = require("../services/users.service");

exports.getUsers = (req, res, next) => {
  getUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
