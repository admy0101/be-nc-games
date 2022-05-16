const { selectAllCategories } = require("../model/games.model");

exports.getAllCategories = (req, res) => {
  selectAllCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
