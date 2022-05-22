const { removeComment } = require("../model/comments.model");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
