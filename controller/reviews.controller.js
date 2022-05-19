const {
  selectReviewById,
  updateReviewByVotes,
  selectAllReviews,
  selectCommentsById,
} = require("../model/reviews.model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewByVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReviewByVotes(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviews = (req, res, next) => {
  selectAllReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getCommentsById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      if (!review) {
        return Promise.reject({ status: 404, msg: "review doesn't exist" });
      } else {
        return selectCommentsById(review_id);
      }
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
