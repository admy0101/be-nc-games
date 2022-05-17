const { selectAllUsers } = require("../model/users.model.js");

exports.getAllUsers = (req, res) => {
  selectAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};
